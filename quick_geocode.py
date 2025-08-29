#!/usr/bin/env python3
"""
Quick script to test geocoding and update a single temple
"""
import json
import requests

def get_coordinates(address):
    """Get coordinates from Nominatim (free OpenStreetMap service)"""
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        'q': address,
        'format': 'json',
        'limit': 1
    }
    headers = {
        'User-Agent': 'TempleGeocoder/1.0'
    }
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        data = response.json()
        
        if data:
            lat = float(data[0]['lat'])
            lng = float(data[0]['lon'])
            print(f"Found coordinates: {lat}, {lng}")
            return lat, lng
        else:
            print("No coordinates found")
            return None, None
    except Exception as e:
        print(f"Error: {e}")
        return None, None

def update_single_temple():
    """Update coordinates for a single temple as a test"""
    file_path = "src/data/temples.json"
    
    # Load the data
    with open(file_path, 'r') as f:
        temples = json.load(f)
    
    # Find a temple with missing coordinates
    test_temple = None
    for temple in temples:
        coords = temple.get('location', {}).get('coordinates', {})
        if coords.get('lat') == 0.0 and coords.get('lng') == 0.0:
            test_temple = temple
            break
    
    if not test_temple:
        print("No temples found with missing coordinates!")
        return
    
    print(f"Testing with: {test_temple['name']}")
    print(f"Address: {test_temple['address']}")
    
    # Get coordinates
    lat, lng = get_coordinates(test_temple['address'])
    
    if lat and lng:
        # Update the temple
        test_temple['location']['coordinates']['lat'] = lat
        test_temple['location']['coordinates']['lng'] = lng
        
        # Save the updated data
        with open(file_path, 'w') as f:
            json.dump(temples, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Updated {test_temple['name']} with coordinates: {lat}, {lng}")
        print("File saved successfully!")
    else:
        print("❌ Could not get coordinates")

if __name__ == "__main__":
    update_single_temple()
