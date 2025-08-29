#!/usr/bin/env python3
"""
Try simplified addresses for the temples that failed geocoding
"""
import json
import requests
import time

def get_coordinates(address):
    """Get coordinates from Nominatim"""
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

def fix_failed_temples():
    """Try simplified addresses for failed temples"""
    file_path = "src/data/temples.json"
    
    # Simplified addresses for the ones that failed
    simplified_addresses = {
        "Aba Nigeria Temple": "Aba, Abia State, Nigeria",
        "Abidjan Ivory Coast Temple": "Cocody, Abidjan, Cote d'Ivoire", 
        "Accra Ghana Temple": "North Ridge, Accra, Ghana",
        "Alabang Philippines Temple": "Alabang, Muntinlupa City, Metro Manila, Philippines",
        "Albuquerque New Mexico Temple": "San Francisco Road, Albuquerque, New Mexico, United States",
        "Apia Samoa Temple": "Pesega, Apia, Samoa",
        "Arequipa Peru Temple": "Carmen Alto, Cayma, Arequipa, Peru", 
        "Asunción Paraguay Temple": "Asunción, Paraguay"
    }
    
    # Load the data
    with open(file_path, 'r') as f:
        temples = json.load(f)
    
    print(f"Trying simplified addresses for {len(simplified_addresses)} temples...\n")
    
    updated_count = 0
    for i, (temple_name, simplified_address) in enumerate(simplified_addresses.items(), 1):
        print(f"[{i}/{len(simplified_addresses)}] {temple_name}")
        print(f"Trying simplified address: {simplified_address}")
        
        # Find the temple in the data
        for temple in temples:
            if temple['name'] == temple_name:
                # Get coordinates with simplified address
                lat, lng = get_coordinates(simplified_address)
                
                if lat and lng:
                    old_lat = temple['location']['coordinates']['lat']
                    old_lng = temple['location']['coordinates']['lng']
                    
                    temple['location']['coordinates']['lat'] = lat
                    temple['location']['coordinates']['lng'] = lng
                    
                    print(f"Old coordinates: {old_lat}, {old_lng}")
                    print(f"New coordinates: {lat}, {lng}")
                    print("✅ Updated successfully")
                    updated_count += 1
                else:
                    print("❌ Still could not get coordinates")
                
                break
        
        print()
        
        # Rate limiting
        if i < len(simplified_addresses):
            time.sleep(1)
    
    # Save the updated data
    with open(file_path, 'w') as f:
        json.dump(temples, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Successfully updated {updated_count} out of {len(simplified_addresses)} temples")
    print("File saved successfully!")

if __name__ == "__main__":
    fix_failed_temples()
