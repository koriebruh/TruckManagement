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

  const {
    location,
    isLoading: isLoadingLocation,
    error: locationError,
    startWatchingLocation,
    stopWatchingLocation,
    getCurrentLocation,
  } = useLocation();

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

  // Send current position to API with retry logic
  const sendCurrentPosition = useCallback(async (): Promise<void> => {
    console.log("🔄 sendCurrentPosition called, location:", location);

    // If no location, try to get it first
    if (!location) {
      console.log("❌ No location available, trying to get current location");
      try {
        await getCurrentLocation();
        // Since getCurrentLocation is async but doesn't return the location,
        // we'll skip this attempt and let the next interval try again
        console.log(
          "⏭️ Location request initiated, will retry in next interval"
        );
        return;
      } catch (error) {
        console.error("❌ Failed to get location:", error);
        throw error;
      }
    }

    const payload: PositionPayload = {
      latitude: location.latitude,
      longitude: location.longitude,
      recorded_at: Math.floor(Date.now() / 1000), // Convert to Unix timestamp
    };

    console.log("📤 Sending position payload:", payload);
    return sendPositionMutation.mutateAsync(payload);
  }, [location, getCurrentLocation, sendPositionMutation]);

  // Send position with location check
  const sendPositionWithLocationCheck = useCallback(async () => {
    try {
      await sendCurrentPosition();
      console.log("✅ Position sent successfully via interval");
    } catch (error) {
      console.error("❌ Failed to send position during tracking:", error);
    }
  }, [sendCurrentPosition]);

  // Start tracking
  const startTracking = useCallback(async () => {
    if (isTracking) {
      console.log("⚠️ Already tracking, skipping start");
      return;
    }

    console.log(
      "🚀 Starting automatic position tracking with interval:",
      interval,
      "ms"
    );
    setIsTracking(true);

    try {
      // Start watching location first
      await startWatchingLocation();
      console.log("📍 Started watching location");

      // Get initial location and send immediately
      console.log("📍 Getting initial location for immediate send...");
      await getCurrentLocation();

      // Wait a bit for location to be set
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Send initial position immediately
      try {
        await sendCurrentPosition();
        console.log("✅ Initial position sent immediately");
      } catch (error) {
        console.log(
          "⚠️ Failed to send initial position, will retry in interval"
        );
      }

      // Set up interval to send position updates every 15 minutes
      intervalRef.current = setInterval(
        sendPositionWithLocationCheck,
        interval
      );
      console.log("✅ Automatic interval set up with ID:", intervalRef.current);
    } catch (error) {
      console.error("❌ Failed to start automatic tracking:", error);
      setIsTracking(false);
    }
  }, [
    isTracking,
    interval,
    startWatchingLocation,
    getCurrentLocation,
    sendCurrentPosition,
    sendPositionWithLocationCheck,
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
