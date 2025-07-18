import api from "@/services/axios";
import { Truck } from "@/types/truck.types";
import { useEffect, useState } from "react";


export function useTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrucks = async () => {
    setLoading(true);
    try {
     const { data } = await api.get("/api/trucks");
      setTrucks(data.data);
      setError(null);
    } catch (err: any) {
        setError(err.message);
        console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  return { trucks, loading, error, refetch: fetchTrucks };
}
