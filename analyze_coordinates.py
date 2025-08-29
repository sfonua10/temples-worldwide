#!/usr/bin/env python3
"""
Script to analyze and add missing coordinates to temples.json
"""
import json
import requests
import time
from typing import Dict, List, Tuple

def load_temples_data(file_path: str) -> List[Dict]:
    """Load temples data from JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_temples_data(file_path: str, data: List[Dict]) -> None:
    """Save temples data to JSON file"""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def has_missing_coordinates(temple: Dict) -> bool:
    """Check if temple has missing coordinates (0.0, 0.0)"""
    coords = temple.get('location', {}).get('coordinates', {})
    lat = coords.get('lat', 0)
    lng = coords.get('lng', 0)
    return lat == 0.0 and lng == 0.0

def get_coordinates_from_nominatim(address: str) -> Tuple[float, float]:
    """
    Get coordinates from Nominatim (OpenStreetMap) geocoding service
    Returns (lat, lng) tuple or (0.0, 0.0) if not found
    """
    base_url = "https://nominatim.openstreetmap.org/search"
    params = {
        'q': address,
        'format': 'json',
        'limit': 1,
        'addressdetails': 1
    }
    
    headers = {
        'User-Agent': 'TempleGeocoder/1.0 (temple-coordinates-update)'
    }
    
    try:
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data and len(data) > 0:
            result = data[0]
            lat = float(result.get('lat', 0))
            lng = float(result.get('lon', 0))
            return lat, lng
        else:
            print(f"No results found for: {address}")
            return 0.0, 0.0
            
    except Exception as e:
        print(f"Error geocoding {address}: {e}")
        return 0.0, 0.0

def analyze_missing_coordinates(temples: List[Dict]) -> None:
    """Analyze and print statistics about missing coordinates"""
    total_temples = len(temples)
    missing_coords = [t for t in temples if has_missing_coordinates(t)]
    
    print(f"Total temples: {total_temples}")
    print(f"Temples with missing coordinates: {len(missing_coords)}")
    print(f"Percentage missing: {len(missing_coords)/total_temples*100:.1f}%")
    
    print("\nTemples with missing coordinates:")
    for temple in missing_coords[:10]:  # Show first 10
        print(f"  - {temple['name']}: {temple['address']}")
    
    if len(missing_coords) > 10:
        print(f"  ... and {len(missing_coords) - 10} more")

def update_coordinates(temples: List[Dict], dry_run: bool = True) -> List[Dict]:
    """Update missing coordinates for temples"""
    updated_temples = temples.copy()
    missing_coords = [t for t in updated_temples if has_missing_coordinates(t)]
    
    print(f"\nProcessing {len(missing_coords)} temples with missing coordinates...")
    
    for i, temple in enumerate(missing_coords):
        print(f"\n[{i+1}/{len(missing_coords)}] Processing: {temple['name']}")
        print(f"Address: {temple['address']}")
        
        if not dry_run:
            lat, lng = get_coordinates_from_nominatim(temple['address'])
            
            if lat != 0.0 or lng != 0.0:
                # Find the temple in the original list and update it
                for orig_temple in updated_temples:
                    if orig_temple['id'] == temple['id']:
                        orig_temple['location']['coordinates']['lat'] = lat
                        orig_temple['location']['coordinates']['lng'] = lng
                        print(f"Updated coordinates: {lat}, {lng}")
                        break
            else:
                print("Could not find coordinates")
            
            # Rate limiting - be respectful to the API
            time.sleep(1)
        else:
            print("(Dry run - not actually updating)")
    
    return updated_temples

if __name__ == "__main__":
    file_path = "/Users/saiafonua/workspace-pro/temples-worldwide/src/data/temples.json"
    
    print("Loading temples data...")
    temples = load_temples_data(file_path)
    
    print("Analyzing missing coordinates...")
    analyze_missing_coordinates(temples)
    
    # Ask user if they want to proceed with updates
    response = input("\nWould you like to update the missing coordinates? (y/N): ")
    if response.lower() == 'y':
        print("\nRunning coordinate updates...")
        updated_temples = update_coordinates(temples, dry_run=False)
        
        # Save updated data
        backup_path = file_path + ".backup"
        print(f"\nSaving backup to: {backup_path}")
        save_temples_data(backup_path, temples)
        
        print(f"Saving updated data to: {file_path}")
        save_temples_data(file_path, updated_temples)
        
        print("Done! Coordinates have been updated.")
    else:
        print("Running dry run only...")
        update_coordinates(temples, dry_run=True)
