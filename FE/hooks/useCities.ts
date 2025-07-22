// src/hooks/useCities.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/axios";
import { CityRequest, CityResponse } from "@/types/city.types";

const getAllCities = async (): Promise<CityResponse[]> => {
  try {
    const { data } = await api.get("/api/cities");
    return data?.data ?? [];
  } catch (error) {
    console.error("❌ Error fetching all cities:", error);
    throw error;
  }
};

const getCityById = async (id: number): Promise<CityResponse> => {
  try {
    const { data } = await api.get(`/api/cities/${id}`);
    return data.data;
  } catch (error) {
    console.error(`❌ Error fetching city with ID ${id}:`, error);
    throw error;
  }
};

const createCity = async (payload: CityRequest): Promise<string> => {
  try {
    const { data } = await api.post("/api/cities", payload);
    return data.data;
  } catch (error) {
    console.error("❌ Error creating city:", error);
    throw error;
  }
};

const updateCity = async ({
  id,
  payload,
}: {
  id: number;
  payload: CityRequest;
}): Promise<string> => {
  try {
    const { data } = await api.put(`/api/cities/${id}`, payload);
    return data.data;
  } catch (error) {
    console.error(`❌ Error updating city with ID ${id}:`, error);
    throw error;
  }
};

const deleteCity = async (id: number): Promise<string> => {
  try {
    const { data } = await api.delete(`/api/cities/${id}`);
    return data.data;
  } catch (error) {
    console.error(`❌ Error deleting city with ID ${id}:`, error);
    throw error;
  }
};

export function useCities() {
  const queryClient = useQueryClient();

  // Queries
  const citiesQuery = useQuery({
    queryKey: ["cities"],
    queryFn: getAllCities,
  });

  // Mutations
  const create = useMutation({
    mutationFn: createCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });

  const update = useMutation({
    mutationFn: updateCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });

  return {
    // Queries
    cities: citiesQuery.data,
    isLoading: citiesQuery.isLoading,
    isError: citiesQuery.isError,
    refetchCities: citiesQuery.refetch,
    getCityById,

    // Mutations
    createCity: create.mutateAsync,
    updateCity: update.mutateAsync,
    deleteCity: remove.mutateAsync,
  };
}
