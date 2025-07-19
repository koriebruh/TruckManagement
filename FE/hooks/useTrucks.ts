import api from "@/services/axios";
import { Truck } from "@/types/truck.types";
import { useEffect, useState } from "react";

export function useTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/trucks");
      setTrucks(data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTruckById = async (truckId: string) => {
    try {
      const { data } = await api.get(`/api/trucks/${truckId}`);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const fetchAvailableTrucks = async () => {
    try {
      const { data } = await api.get("/api/trucks/available");
      return data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const createTruck = async (truck: Partial<Truck>) => {
    try {
      const { data } = await api.post("/api/trucks", truck);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateTruck = async (truckId: string, truck: Partial<Truck>) => {
    try {
      const { data } = await api.put(`/api/trucks/${truckId}`, truck);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteTruck = async (truckId: string) => {
    try {
      const { data } = await api.delete(`/api/trucks/${truckId}`);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const setMaintenanceTruck = async (truckId: string) => {
    try {
      const { data } = await api.put(`/api/trucks/maintenance/${truckId}`);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  return {
    trucks,
    loading,
    error,
    refetch: fetchTrucks,
    fetchTruckById,
    fetchAvailableTrucks,
    createTruck,
    updateTruck,
    deleteTruck,
    setMaintenanceTruck,
  };
}
