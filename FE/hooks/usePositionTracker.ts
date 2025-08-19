// hooks/usePositionTracker.ts
import { useMutation } from "@tanstack/react-query";
import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, LocationData } from "./useLocation";
import api from "@/services/axios";

interface PositionPayload {
  latitude: number;
  longitude: number;
  recorded_at: number; // Unix timestamp
}

interface UsePositionTrackerOptions {
  autoTrack?: boolean; // Automatically start tracking when component mounts
  interval?: number; // Interval in milliseconds to send position updates
}

interface UsePositionTrackerReturn {
  isTracking: boolean;
  location: LocationData | null;
  isLoadingLocation: boolean;
  locationError: string | null;
  isSendingPosition: boolean;
  sendPositionError: string | null;
  lastSentAt: Date | null;
  startTracking: () => void;
  stopTracking: () => void;
  sendCurrentPosition: () => Promise<void>;
}

// API function to send position
const sendPositionToAPI = async (position: PositionPayload): Promise<any> => {
  const response = await api.post("/api/delivery/position", position);

  if (response.status !== 200) {
    throw new Error(`Failed to send position: ${response.status}`);
  }

  return response.data;
};

export const usePositionTracker = (
  options: UsePositionTrackerOptions = {}
): UsePositionTrackerReturn => {
  const { autoTrack = false, interval = 900000 } = options; // Default 15 minutes

  const [isTracking, setIsTracking] = useState(false);
  const [lastSentAt, setLastSentAt] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  const locationRef = useRef<LocationData | null>(null); // Keep location in ref for immediate access

  const {
    location,
    isLoading: isLoadingLocation,
    error: locationError,
    startWatchingLocation,
    stopWatchingLocation,
    getCurrentLocation,
  } = useLocation();

  // Update location ref whenever location changes
  useEffect(() => {
    if (location) {
      locationRef.current = location;
      console.log("📍 Location ref updated:", location);
    }
  }, [location]);

  // Mutation for sending position to API
  const sendPositionMutation = useMutation({
    mutationFn: sendPositionToAPI,
    onSuccess: (data) => {
      setLastSentAt(new Date());
      console.log("✅ Position sent successfully:", data);
    },
    onError: (error: Error) => {
      console.error("❌ Failed to send position:", error.message);
    },
  });

  // Get current location with timeout
  const getLocationWithTimeout = useCallback(
    async (timeoutMs: number = 5000): Promise<LocationData | null> => {
      console.log("📍 Getting location with timeout:", timeoutMs, "ms");

      // If we already have location in ref, use it
      if (locationRef.current) {
        console.log("✅ Using cached location from ref");
        return locationRef.current;
      }

      // Try to get fresh location
      try {
        await getCurrentLocation();

        // Wait for location with timeout
        const startTime = Date.now();
        while (!locationRef.current && Date.now() - startTime < timeoutMs) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        return locationRef.current;
      } catch (error) {
        console.error("❌ Failed to get location:", error);
        return null;
      }
    },
    [getCurrentLocation]
  );

  // Send position with robust location handling
  const sendPositionRobust = useCallback(async (): Promise<boolean> => {
    console.log("🔄 Attempting to send position...");

    // Try to get location (use cached or fetch new)
    const currentLocation = await getLocationWithTimeout(3000);

    if (!currentLocation) {
      console.log("❌ No location available after timeout, skipping send");
      return false;
    }

    try {
      const payload: PositionPayload = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        recorded_at: Math.floor(Date.now() / 1000),
      };

      console.log("📤 Sending position:", payload);
      await sendPositionMutation.mutateAsync(payload);
      console.log("✅ Position sent successfully!");
      return true;
    } catch (error) {
      console.error("❌ Failed to send position:", error);
      return false;
    }
  }, [getLocationWithTimeout, sendPositionMutation]);

  // Send current position (for external use)
  const sendCurrentPosition = useCallback(async (): Promise<void> => {
    const success = await sendPositionRobust();
    if (!success) {
      throw new Error("Failed to send position");
    }
  }, [sendPositionRobust]);

  // Interval function for automatic sending
  const intervalSendPosition = useCallback(async () => {
    console.log("⏰ Interval triggered - attempting automatic send");
    await sendPositionRobust(); // This will handle all error cases silently
  }, [sendPositionRobust]);

  // Start tracking
  const startTracking = useCallback(async () => {
    if (isTracking) {
      console.log("⚠️ Already tracking, skipping start");
      return;
    }

    console.log("🚀 Starting automatic position tracking...");
    console.log("📊 Interval:", interval, "ms (", interval / 60000, "minutes)");
    setIsTracking(true);

    try {
      // Start watching location
      await startWatchingLocation();
      console.log("📍 Location watching started");

      // Try to get initial location and send immediately
      console.log("📍 Getting initial location...");
      const initialSuccess = await sendPositionRobust();

      if (initialSuccess) {
        console.log("✅ Initial position sent successfully");
      } else {
        console.log("⚠️ Initial send failed, will retry in first interval");
      }

      // Set up interval for automatic sending
      intervalRef.current = setInterval(intervalSendPosition, interval);
      console.log("✅ Automatic sending interval set up");
    } catch (error) {
      console.error("❌ Failed to start tracking:", error);
      setIsTracking(false);
    }
  }, [
    isTracking,
    interval,
    startWatchingLocation,
    sendPositionRobust,
    intervalSendPosition,
  ]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (!isTracking) {
      console.log("⚠️ Not tracking, skipping stop");
      return;
    }

    console.log("🛑 Stopping position tracking...");
    setIsTracking(false);

    // Stop watching location
    stopWatchingLocation();

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("✅ Interval cleared");
    }
  }, [isTracking, stopWatchingLocation]);

  // Auto-start tracking if enabled (only run once)
  useEffect(() => {
    if (autoTrack && !isInitialized.current) {
      console.log("🚀 Auto-starting automatic position tracking...");
      isInitialized.current = true;
      // Small delay to ensure component is fully mounted
      setTimeout(() => {
        startTracking();
      }, 1000);
    }

    return () => {
      console.log("🧹 Cleanup: stopping automatic tracking");
      stopTracking();
    };
  }, []); // Empty dependency array to run only once

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isTracking,
    location,
    isLoadingLocation,
    locationError,
    isSendingPosition: sendPositionMutation.isPending,
    sendPositionError: sendPositionMutation.error?.message || null,
    lastSentAt,
    startTracking,
    stopTracking,
    sendCurrentPosition, // Keep this for internal use only
  };
};
