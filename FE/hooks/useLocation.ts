// hooks/useLocation.ts
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  region?: string;
  country?: string;
  address?: string;
}

export interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  startWatchingLocation: () => void;
  stopWatchingLocation: () => void;
  isWatching: boolean;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchSubscription, setWatchSubscription] =
    useState<Location.LocationSubscription | null>(null);

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus !== "granted") {
        setError("Permission to access location was denied");
        return false;
      }

      // Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        setError("Location services are not enabled");
        return false;
      }

      return true;
    } catch (err) {
      setError("Failed to request location permission");
      return false;
    }
  };

  // Get current location once
  const getCurrentLocation = async (): Promise<void> => {
    console.log("📍 getCurrentLocation called");
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.log("❌ Location permission denied");
        setIsLoading(false);
        return;
      }

      console.log("📍 Getting current position...");
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      const { latitude, longitude, accuracy } = locationResult.coords;
      console.log("📍 Got coordinates:", { latitude, longitude, accuracy });

      // Get reverse geocoding (address info)
      let locationData: LocationData = {
        latitude,
        longitude,
        accuracy: accuracy || undefined,
      };

      try {
        const geocoding = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (geocoding && geocoding.length > 0) {
          const address = geocoding[0];
          locationData = {
            ...locationData,
            city: address.city || undefined,
            region: address.region || undefined,
            country: address.country || undefined,
            address: [
              address.name,
              address.street,
              address.city,
              address.region,
              address.country,
            ]
              .filter(Boolean)
              .join(", "),
          };
          console.log("📍 Geocoding successful:", address.city);
        }
      } catch (geocodingError) {
        console.warn("Reverse geocoding failed:", geocodingError);
        // Continue without address info
      }

      setLocation(locationData);
      console.log("✅ Location set successfully:", locationData);
    } catch (err) {
      console.error("❌ Location error:", err);
      setError(
        "Failed to get current location. Please check your GPS settings."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Start watching location changes
  const startWatchingLocation = async (): Promise<void> => {
    if (isWatching) {
      console.log("⚠️ Already watching location");
      return;
    }

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      console.log("👀 Starting to watch location changes");
      setIsWatching(true);
      setError(null);

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 5, // Update when moved 5 meters
        },
        async (locationResult) => {
          const { latitude, longitude, accuracy } = locationResult.coords;
          console.log("📍 Location updated:", { latitude, longitude });

          let locationData: LocationData = {
            latitude,
            longitude,
            accuracy: accuracy || undefined,
          };

          try {
            const geocoding = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });

            if (geocoding && geocoding.length > 0) {
              const address = geocoding[0];
              locationData = {
                ...locationData,
                city: address.city || undefined,
                region: address.region || undefined,
                country: address.country || undefined,
                address: [
                  address.name,
                  address.street,
                  address.city,
                  address.region,
                  address.country,
                ]
                  .filter(Boolean)
                  .join(", "),
              };
            }
          } catch (geocodingError) {
            console.warn("Reverse geocoding failed:", geocodingError);
          }

          setLocation(locationData);
        }
      );

      setWatchSubscription(subscription);
    } catch (err) {
      console.error("Watch location error:", err);
      setError("Failed to start location tracking");
      setIsWatching(false);
    }
  };

  // Stop watching location changes
  const stopWatchingLocation = (): void => {
    if (watchSubscription) {
      watchSubscription.remove();
      setWatchSubscription(null);
    }
    setIsWatching(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatchingLocation();
    };
  }, []);

  return {
    location,
    isLoading,
    error,
    requestLocationPermission,
    getCurrentLocation,
    startWatchingLocation,
    stopWatchingLocation,
    isWatching,
  };
};
