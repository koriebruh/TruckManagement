export interface CityRequest {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface CityResponse {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}
