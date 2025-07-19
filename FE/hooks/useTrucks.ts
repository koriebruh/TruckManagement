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
      // Validasi payload sebelum dikirim
      if (
        !truck.licensePlate ||
        !truck.model ||
        !truck.cargoType ||
        !truck.capacityKG
      ) {
        throw new Error("Semua field wajib diisi");
      }

      // Bersihkan dan konversi data dengan tipe yang tepat
      const licensePlate = String(truck.licensePlate).trim().toUpperCase();
      const model = String(truck.model).trim();
      const cargoType = String(truck.cargoType).trim();
      const capacityKG = parseFloat(String(truck.capacityKG));
      const isAvailable = Boolean(truck.isAvailable ?? true);

      // Validasi tambahan
      if (isNaN(capacityKG) || capacityKG <= 0) {
        throw new Error(
          "Kapasitas harus berupa angka yang valid dan lebih besar dari 0"
        );
      }

      // Validasi panjang string sesuai constraint backend
      if (licensePlate.length > 20) {
        throw new Error("Nomor plat tidak boleh lebih dari 20 karakter");
      }

      if (model.length > 50) {
        throw new Error("Model tidak boleh lebih dari 50 karakter");
      }

      if (cargoType.length > 100) {
        throw new Error("Jenis muatan tidak boleh lebih dari 100 karakter");
      }

      // Pastikan format yang dikirim sesuai dengan yang diharapkan backend Java
      const payload = {
        licensePlate: licensePlate,
        model: model,
        cargoType: cargoType,
        capacityKG: capacityKG, // Pastikan ini Double/float
        isAvailable: isAvailable,
      };

      console.log(
        "🚚 Final payload dikirim:",
        JSON.stringify(payload, null, 2)
      );

      // Tambahkan explicit headers dan timeout
      const response = await api.post("/api/trucks", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000, // 10 detik timeout
        // Pastikan data di-serialize dengan benar
        transformRequest: [
          (data) => {
            console.log("🔄 Transform request data:", data);
            return JSON.stringify(data);
          },
        ],
      });

      console.log("✅ Response berhasil:", response.data);
      return response.data;
    } catch (err: any) {
      console.error("❌ Error detail dalam createTruck:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
        url: err.config?.url,
        method: err.config?.method,
        data: err.config?.data,
      });

      // Handle different error responses
      if (err.response) {
        const status = err.response.status;
        const responseData = err.response.data;

        if (status === 400) {
          // Bad Request - biasanya validation error
          let errorMsg = "Data yang dikirim tidak valid";

          if (responseData?.message) {
            errorMsg = responseData.message;
          } else if (responseData?.error) {
            errorMsg = responseData.error;
          } else if (
            responseData?.errors &&
            Array.isArray(responseData.errors)
          ) {
            // Jika ada multiple validation errors
            errorMsg = responseData.errors.join(", ");
          }

          throw new Error(errorMsg);
        } else if (status === 409) {
          // Conflict - mungkin duplicate license plate
          throw new Error("Nomor plat sudah terdaftar");
        } else if (status >= 500) {
          // Server errors
          throw new Error("Terjadi kesalahan pada server. Silakan coba lagi.");
        }
      }

      // Network atau error lainnya
      if (err.code === "ECONNABORTED") {
        throw new Error("Request timeout. Silakan coba lagi.");
      }

      throw new Error(err.message || "Gagal menambahkan truk");
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
