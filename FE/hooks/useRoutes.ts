// src/hooks/useRoutes.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/axios";
import { RouteRequest, RouteResponse } from "@/types/route.types";

const getAllRoutes = async (): Promise<RouteResponse[]> => {
  const { data } = await api.get("/api/routes");
  return data.data;
};

const getRouteById = async (routeId: string): Promise<RouteResponse> => {
  const { data } = await api.get(`/api/routes/${routeId}`);
  return data.data;
};

const createRoute = async (payload: RouteRequest): Promise<string> => {
  const { data } = await api.post("/api/routes", payload);
  return data.data;
};

const updateRoute = async ({
  id,
  payload,
}: {
  id: string;
  payload: RouteRequest;
}): Promise<string> => {
  const { data } = await api.put(`/api/routes/${id}`, payload);
  return data.data;
};

const deleteRoute = async (id: string): Promise<string> => {
  const { data } = await api.delete(`/api/routes/${id}`);
  return data.data;
};

export function useRoutes() {
  const queryClient = useQueryClient();

  const routesQuery = useQuery({
    queryKey: ["routes"],
    queryFn: getAllRoutes,
  });

  const create = useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });

  const update = useMutation({
    mutationFn: updateRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });

  return {
    // Queries
    routes: routesQuery.data,
    isLoading: routesQuery.isLoading,
    isError: routesQuery.isError,
    refetchRoutes: routesQuery.refetch,
    getRouteById,
    error: routesQuery.error,
    

    // Mutations
    createRoute: create.mutateAsync,
    updateRoute: update.mutateAsync,
    deleteRoute: remove.mutateAsync,
  };
}
