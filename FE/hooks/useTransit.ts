import api from "@/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types with snake_case
export interface TransitRequest {
  delivery_id: string;
  transit_point_id: number;
}

export interface TransitResponse {
  status: string;
  message?: string;
  data?: any;
}

export interface TransitPoint {
  id: number;
  loading_city_id: number;
  unloading_city_id: number;
  estimated_duration_minute: number;
  extra_cost: number;
  is_active: boolean;
}

export interface TransitPointsResponse {
  status: string;
  data: TransitPoint[];
}

export interface DeliveryForTransit {
  id: string;
  route_id: string;
  status: string;
  current_location?: string;
  worker_id?: string;
  truck_id?: string;
  started_at?: number;
}

export interface ActiveDeliveriesResponse {
  status: string;
  data: DeliveryForTransit[];
}

// City mapping (you might want to fetch this from API too)
export interface City {
  id: number;
  name: string;
}

// Fetch available transit points
const fetchTransitPoints = async (): Promise<TransitPointsResponse> => {
  const response = await api.get("/api/transit-points");
  return response.data;
};

// Fetch cities for mapping
const fetchCities = async (): Promise<{ status: string; data: City[] }> => {
  const response = await api.get("api/cities");
  return response.data;
};

// Submit transit
const submitTransit = async (
  transitData: TransitRequest
): Promise<TransitResponse> => {
  const response = await api.post("api/delivery/transit", transitData);
  return response.data;
};



// Hook for transit points
export const useTransitPoints = () => {
  return useQuery({
    queryKey: ["transit-points"],
    queryFn: fetchTransitPoints,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data) => ({
      ...data,
      data: data.data.filter((point) => point.is_active), // Only return active points
    }),
  });
};

// Hook for cities (for mapping city IDs to names)
export const useCities = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
    staleTime: 30 * 60 * 1000, // 30 minutes - cities don't change often
  });
};

// Hook for submitting transit
export const useSubmitTransit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitTransit,
    onSuccess: () => {
      // Refresh active deliveries after successful transit
      queryClient.invalidateQueries({ queryKey: ["active-deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-history"] });
    },
  });
};

// Helper function to get city name by ID
export const getCityName = (cityId: number, cities: City[] = []) => {
  return cities.find((city) => city.id === cityId)?.name || `City ${cityId}`;
};
