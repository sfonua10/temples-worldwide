#!/usr/bin/env python3
"""
Update specific temples with new addresses and coordinates
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

def update_temple_addresses():
    """Update specific temples with new addresses and coordinates"""
    file_path = "src/data/temples.json"
    
    # Updated addresses
    updated_addresses = {
        "Aba Nigeria Temple": "72-80 Okpu-Umuobo Rd Aba Abia State Nigeria",
        "Abidjan Ivory Coast Temple": "Lot 118 Riviera Attoban Cocody Abidjan Cote d'Ivoire",
        "Accra Ghana Temple": "Accra Ghana Temple Complex 57 Independence Ave North Ridge P.M.B. CT 209, Cantonments Accra Ghana",
        "Adelaide Australia Temple": "53-59 Lower Portrush Rd Marden SA 5070 Australia",
        "Alabang Philippines Temple": "#5 Filinvest Ave Corner Corporate Ave Filinvest Corporate City , Alabang, Muntinlupa City 1781 Metro Manila Philippines",
        "Albuquerque New Mexico Temple": "10301 San Francisco Rd NE Albuquerque NM 87122-3437 United States",
        "Anchorage Alaska Temple": "13161 Brayton Dr Anchorage AK 99516 United States",
        "Antofagasta Chile Temple": "Las Palmeras 44 Antofagasta Chile",
        "Apia Samoa Temple": "Vaitele Street Pesega Apia Samoa",
        "Arequipa Peru Temple": "Calle Cusco 380 Carmen Alto Distrito De Cayma Arequipa Arequipa Peru",
        "Asunción Paraguay Temple": "Avda Brasilia Esquina Avda España Asunción Paraguay",
        "Atlanta Georgia Temple": "6450 Barfield Rd NE Sandy Springs GA 30328-4283 United States",
        "Auckland New Zealand Temple": "19 Redoubt Road Goodwood Heights 2105 New Zealand"
    }
    
    # Load the data
    with open(file_path, 'r') as f:
        temples = json.load(f)
    
    print(f"Updating {len(updated_addresses)} temples with new addresses and coordinates...\n")
    
    updated_count = 0
    for i, (temple_name, new_address) in enumerate(updated_addresses.items(), 1):
        print(f"[{i}/{len(updated_addresses)}] {temple_name}")
        
        # Find the temple in the data
        temple_found = False
        for temple in temples:
            if temple['name'] == temple_name:
                temple_found = True
                old_address = temple['address']
                print(f"Old address: {old_address}")
                print(f"New address: {new_address}")
                
                # Update the address
                temple['address'] = new_address
                
                # Get new coordinates
                lat, lng = get_coordinates(new_address)
                
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
                    print("❌ Could not get new coordinates")
                
                break
        
        if not temple_found:
            print(f"❌ Temple '{temple_name}' not found in data")
        
        print()  # Empty line for readability
        
        # Rate limiting
        if i < len(updated_addresses):
            time.sleep(1)
    
    # Save the updated data
    with open(file_path, 'w') as f:
        json.dump(temples, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Successfully updated {updated_count} out of {len(updated_addresses)} temples")
    print("File saved successfully!")

if __name__ == "__main__":
    update_temple_addresses()
