export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  city: string;
  state?: string;
  region?: string;
  province?: string;
  country: string;
  coordinates: Coordinates;
}

export interface Temple {
  id: number;
  name: string;
  location: Location;
  address: string;
  dedicationDate: string | null;
  status: 'Operating' | 'Under Construction' | 'Announced' | 'Closed for Renovation';
}