#!/usr/bin/env python3
"""
Update coordinates for the next 5 temples with missing data
"""
import json
import requests
import time

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
            return lat, lng
        else:
            return None, None
    except Exception as e:
        print(f"Error geocoding: {e}")
        return None, None

def update_next_temples(count=5):
    """Update coordinates for the next batch of temples"""
    file_path = "src/data/temples.json"
    
    # Load the data
    with open(file_path, 'r') as f:
        temples = json.load(f)
    
    # Find temples with missing coordinates (skip ones already updated)
    missing_temples = []
    for temple in temples:
        coords = temple.get('location', {}).get('coordinates', {})
        if coords.get('lat') == 0.0 and coords.get('lng') == 0.0:
            missing_temples.append(temple)
    
    if not missing_temples:
        print("No temples found with missing coordinates!")
        return
    
    # Take the next batch
    batch = missing_temples[:count]
    
    print(f"Updating coordinates for {len(batch)} temples...\n")
    
    updated_count = 0
    for i, temple in enumerate(batch, 1):
        print(f"[{i}/{len(batch)}] {temple['name']}")
        print(f"Address: {temple['address']}")
        
        # Get coordinates
        lat, lng = get_coordinates(temple['address'])
        
        if lat and lng:
            temple['location']['coordinates']['lat'] = lat
            temple['location']['coordinates']['lng'] = lng
            print(f"✅ Updated: {lat}, {lng}")
            updated_count += 1
        else:
            print("❌ Could not find coordinates")
        
        print()  # Empty line for readability
        
        # Rate limiting - be respectful to the free service
        if i < len(batch):
            time.sleep(1)
    
    # Save the updated data
    with open(file_path, 'w') as f:
        json.dump(temples, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Successfully updated {updated_count} out of {len(batch)} temples")
    print(f"Remaining temples with missing coordinates: {len(missing_temples) - len(batch)}")

if __name__ == "__main__":
    update_next_temples(5)
