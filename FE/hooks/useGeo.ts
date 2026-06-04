// hooks/useGeo.ts
import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

export interface AutocompleteResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    name?: string;
    road?: string;
    city?: string;
    country?: string;
  };
}

export interface DirectionsResponse {
  routes: Array<{
    geometry: string;
    duration: number;
    distance: number;
  }>;
  waypoints: Array<any>;
}

export interface MatchingResponse {
  matchings: Array<{
    geometry: string;
    confidence: number;
    duration: number;
    distance: number;
  }>;
  tracepoints: Array<any>;
}

export const useGeoDirections = (points: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["geo", "directions", points],
    queryFn: async () => {
      const { data } = await api.get(`/api/geo/directions`, { params: { points } });
      return data.data as DirectionsResponse;
    },
    enabled: enabled && !!points,
  });
};

export const useGeoMatching = (points: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["geo", "matching", points],
    queryFn: async () => {
      const { data } = await api.get(`/api/geo/matching`, { params: { points } });
      return data.data as MatchingResponse;
    },
    enabled: enabled && !!points,
  });
};
