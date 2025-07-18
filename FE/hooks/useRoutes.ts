import api from "@/services/axios";
import { Route } from "@/types/route.types";
import { useEffect, useState } from "react";

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await api.get("/api/routes");
        setRoutes(res.data.data);
      } catch (err: any) {
        console.log("Route fetch error:", err);
        setError(err.response?.data?.message || "Failed to fetch routes");
      } finally {
        setLoading(false);
      }
    };
    console.log(routes);

    fetchRoutes();
  }, []);

  return { routes, loading, error };
}
