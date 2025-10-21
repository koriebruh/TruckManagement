import api from "@/services/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface Truck {
  id: string;
  license_plate: string;
  model: string;
  capacity_kg: number;
  cargo_type: string;
  is_available: boolean;
  deleted_at: number | null;
}

export interface TruckResponse {
  status: string;
  data: Truck;
}

export interface TrucksResponse {
  status: string;
  data: Truck[];
}

export interface CreateTruckData {
  license_plate: string;
  model: string;
  capacity_kg: number;
  cargo_type: string;
  is_available?: boolean;
}

export interface UpdateTruckData {
  license_plate?: string;
  model?: string;
  capacity_kg?: number;
  cargo_type?: string;
  is_available?: boolean;
}

export interface MaintenanceData {
  truck_id: string;
  description?: string;
  cost?: number;
}

// API functions
const fetchTrucks = async (): Promise<TrucksResponse> => {
  const response = await api.get("/api/trucks");

  if (response.status !== 200) {
    throw new Error("Failed to fetch trucks");
  }

  return response.data;
};

const fetchTruckById = async (truckId: string): Promise<TruckResponse> => {
  const response = await api.get(`/api/trucks/${truckId}`);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch truck ${truckId}`);
  }

  return response.data;
};

const fetchAvailableTrucks = async (): Promise<TrucksResponse> => {
  const response = await api.get("/api/trucks/available");

  if (response.status !== 200) {
    throw new Error("Failed to fetch available trucks");
  }

  return response.data;
};

const createTruck = async (data: CreateTruckData): Promise<TruckResponse> => {
  const response = await api.post("/api/trucks", data);

  if (response.status !== 201 && response.status !== 200) {
    throw new Error("Failed to create truck");
  }

  return response.data;
};

const updateTruck = async (truckId: string, data: UpdateTruckData): Promise<TruckResponse> => {
  const response = await api.put(`/api/trucks/${truckId}`, data);

  if (response.status !== 200) {
    throw new Error("Failed to update truck");
  }

  return response.data;
};

const deleteTruck = async (truckId: string): Promise<void> => {
  const response = await api.delete(`/api/trucks/${truckId}`);

  if (response.status !== 200 && response.status !== 204) {
    throw new Error("Failed to delete truck");
  }
};

const toggleTruckAvailability = async (truckId: string): Promise<TruckResponse> => {
  const response = await api.get(`/api/trucks/toggle-availability/${truckId}`);

  if (response.status !== 200) {
    throw new Error("Failed to toggle truck availability");
  }

  return response.data;
};

const updateTruckMaintenance = async (truckId: string, data: MaintenanceData): Promise<TruckResponse> => {
  const response = await api.put(`/api/trucks/maintenance/${truckId}`, data);

  if (response.status !== 200) {
    throw new Error("Failed to update truck maintenance");
  }

  return response.data;
};

// Custom hooks

// Hook to get all trucks
export const useTrucks = () => {
  return useQuery({
    queryKey: ["trucks"],
    queryFn: fetchTrucks,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get truck by ID
export const useTruck = (truckId: string) => {
  return useQuery({
    queryKey: ["truck", truckId],
    queryFn: () => fetchTruckById(truckId),
    enabled: !!truckId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get available trucks
export const useAvailableTrucks = () => {
  return useQuery({
    queryKey: ["trucks", "available"],
    queryFn: fetchAvailableTrucks,
    staleTime: 1 * 60 * 1000, // 1 minute - more frequent updates for availability
    gcTime: 5 * 60 * 1000,
  });
};

// Hook to create truck
export const useCreateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTruck,
    onSuccess: () => {
      // Invalidate and refetch trucks list
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
  
  });
};

// Hook to update truck
export const useUpdateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ truckId, data }: { truckId: string; data: UpdateTruckData }) =>
      updateTruck(truckId, data),
    onSuccess: (data, variables) => {
      // Update the specific truck in cache
      queryClient.setQueryData(["truck", variables.truckId], data);
      // Invalidate trucks list to refetch
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },

  });
};

// Hook to delete truck
export const useDeleteTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTruck,
    onSuccess: () => {
      // Invalidate trucks list
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
    onError: (error) => {
      console.error("Delete truck error:", error);
    },
  });
};

// Hook to toggle truck availability
export const useToggleTruckAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTruckAvailability,
    onSuccess: (data, truckId) => {
      // Update the specific truck in cache
      queryClient.setQueryData(["truck", truckId], data);
      // Invalidate trucks lists to refetch
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      queryClient.invalidateQueries({ queryKey: ["trucks", "available"] });
    },
    onError: (error) => {
      console.error("Toggle truck availability error:", error);
    },
  });
};

// Hook to update truck maintenance
export const useUpdateTruckMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ truckId, data }: { truckId: string; data: MaintenanceData }) =>
      updateTruckMaintenance(truckId, data),
    onSuccess: (data, variables) => {
      // Update the specific truck in cache
      queryClient.setQueryData(["truck", variables.truckId], data);
      // Invalidate trucks list to refetch
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
    onError: (error) => {
      console.error("Update truck maintenance error:", error);
    },
  });
};

// Query key factory for better cache management
export const truckKeys = {
  all: ["trucks"] as const,
  lists: () => [...truckKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...truckKeys.lists(), { filters }] as const,
  details: () => [...truckKeys.all, "detail"] as const,
  detail: (id: string) => [...truckKeys.details(), id] as const,
  available: () => [...truckKeys.all, "available"] as const,
};
