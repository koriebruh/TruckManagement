import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/axios";
import {
  AllDeliveryActiveResponse,
  DeliveryDetailResponse,
} from "@/types/delivery.types";

// Get all active deliveries with error fallback
const getAllActiveDeliveries = async (): Promise<
  AllDeliveryActiveResponse[]
> => {
  try {
    const { data } = await api.get("/api/delivery/active");
    return data.data;
  } catch (error: any) {
    if (
      error.response?.status === 404 &&
      error.response?.data?.errors === "No active deliveries found"
    ) {
      return [];
    }
    throw error;
  }
};

// Get detail by ID
const getDeliveryDetailById = async (
  deliveryId: string
): Promise<DeliveryDetailResponse> => {
  const { data } = await api.get(`/api/delivery/detail/${deliveryId}`);
  return data.data;
};

export function useDeliveries() {
  const queryClient = useQueryClient();

  const {
    data: activeDeliveries = [],
    refetch: refetchActive,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["activeDeliveries"],
    queryFn: getAllActiveDeliveries,
    retry: (count, error: any) => {
      const status = error?.response?.status;
      const noActiveMsg = error?.response?.data?.errors;
      return status !== 404 || noActiveMsg !== "No active deliveries found";
    },
    staleTime: 10000,
  });

  const useDeliveryDetailById = (deliveryId: string) =>
    useQuery({
      queryKey: ["deliveryDetail", deliveryId],
      queryFn: () => getDeliveryDetailById(deliveryId),
      enabled: !!deliveryId,
      retry: false,
      staleTime: 30000,
    });

  return {
    data: activeDeliveries,
    isLoading,
    isError,
    error,
    refetch: refetchActive,
    useDeliveryDetailById,
  };
}
