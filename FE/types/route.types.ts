export interface RouteRequest {
  start_city_id: number | string;
  end_city_id: number | string;
  details: string;
  base_price: number | string;
  is_active: boolean;
}

export interface RouteResponse {
  id: string;
  start_city_name: string;
  end_city_name: string;
  details: string;
  base_price: number;
  distance_km: number;
  estimated_duration_hours: number;
  is_active: boolean;
  created_at: number;
}
