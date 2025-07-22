// src/hooks/useActiveDeliveries.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/services/axios";
import { ActiveDelivery } from "@/types/delivery.types";

const fetchActiveDeliveries = async (): Promise<ActiveDelivery[]> => {
  try {
    const response = await api.get("/api/delivery/active");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("❌ Error fetching active deliveries:", error);
    throw error;
  }
};

export function useActiveDeliveries() {
  const query = useQuery({
    queryKey: ["active-deliveries"],
    queryFn: fetchActiveDeliveries,
  });

  return {
    activeDeliveries: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    error: query.error,
  };
}
