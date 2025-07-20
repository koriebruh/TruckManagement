import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/axios";
import { Truck } from "@/types/truck.types";

// Fetch all trucks
const fetchTrucks = async (): Promise<Truck[]> => {
  const { data } = await api.get("/api/trucks");
  return data.data;
};

// Fetch truck by ID
const fetchTruckById = async (truck_id: string): Promise<Truck> => {
  const { data } = await api.get(`/api/trucks/${truck_id}`);
  return data.data;
};

// Fetch available trucks
const fetchAvailableTrucks = async (): Promise<Truck[]> => {
  const { data } = await api.get("/api/trucks/available");
  return data.data;
};

// Create truck
const createTruckRequest = async (truck: Partial<Truck>) => {
  if (
    !truck.license_plate ||
    !truck.model ||
    !truck.cargo_type ||
    !truck.capacity_kg
  ) {
    throw new Error("Semua field wajib diisi");
  }

  const payload = {
    license_plate: truck.license_plate.trim().toUpperCase(),
    model: truck.model.trim(),
    cargo_type: truck.cargo_type.trim(),
    capacity_kg: parseFloat(String(truck.capacity_kg)),
    is_available: Boolean(truck.is_available ?? true),
  };

  const { data } = await api.post("/api/trucks", payload);
  return data.data;
};

// Update truck
const updateTruckRequest = async ({
  truck_id,
  truck,
}: {
  truck_id: string;
  truck: Partial<Truck>;
}) => {
  const payload = {
    license_plate: truck.license_plate?.trim().toUpperCase(),
    model: truck.model?.trim(),
    cargo_type: truck.cargo_type?.trim(),
    capacity_kg: truck.capacity_kg,
    is_available: truck.is_available,
  };

  const { data } = await api.put(`/api/trucks/${truck_id}`, payload);
  return data.data;
};

// Delete truck
const deleteTruckRequest = async (truck_id: string) => {
  const { data } = await api.delete(`/api/trucks/${truck_id}`);
  return data.data;
};

// Set truck to maintenance
const setMaintenanceTruckRequest = async (truck_id: string) => {
  const { data } = await api.put(`/api/trucks/maintenance/${truck_id}`);
  return data.data;
};

// Main Hook
export function useTrucks() {
  const queryClient = useQueryClient();

  const {
    data: trucks,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Truck[]>({
    queryKey: ["trucks"],
    queryFn: fetchTrucks,
  });

  const { data: availableTrucks, refetch: refetchAvailable } = useQuery<
    Truck[]
  >({
    queryKey: ["available_trucks"],
    queryFn: fetchAvailableTrucks,
  });

  const createTruck = useMutation({
    mutationFn: createTruckRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
  });

  const updateTruck = useMutation({
    mutationFn: updateTruckRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
  });

  const deleteTruck = useMutation({
    mutationFn: deleteTruckRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
  });

  const setMaintenanceTruck = useMutation({
    mutationFn: setMaintenanceTruckRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
  });

  return {
    trucks,
    availableTrucks,
    isLoading,
    isError,
    error,
    refetch,
    refetchAvailable,
    fetchTruckById,
    createTruck: createTruck.mutateAsync,
    updateTruck: updateTruck.mutateAsync,
    deleteTruck: deleteTruck.mutateAsync,
    setMaintenanceTruck: setMaintenanceTruck.mutateAsync,
  };
}
