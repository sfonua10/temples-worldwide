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
  images?: {
    hero?: string;
    gallery?: string[];
    thumbnail?: string;
  };
  media?: {
    videoUrl?: string;
    panoramic360Url?: string;
  };
  details?: {
    description?: string;
    architect?: string;
    totalFloorArea?: string;
    numberOfSeatingRooms?: number;
    numberOfOrdinanceRooms?: number;
    visitorCenter?: boolean;
    distribution?: boolean;
    patronHousing?: boolean;
    cafeteria?: boolean;
    clothing?: boolean;
  };
  history?: {
    groundbreaking?: string;
    publicOpenHouse?: {
      start: string;
      end: string;
    };
    rededication?: string;
    closure?: string;
    renovation?: {
      start?: string;
      end?: string;
    };
  };
}