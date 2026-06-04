// hooks/usePositionTracker.ts
import { useMutation } from "@tanstack/react-query";
import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, LocationData } from "./useLocation";
import api from "@/services/axios";
import { BackgroundLocationService } from "@/services/backgroundLocationService";
import * as Location from 'expo-location';

interface PositionPayload {
  latitude: number;
  longitude: number;
  recorded_at: number; // Unix timestamp
}

interface UsePositionTrackerOptions {
  autoTrack?: boolean; // Automatically start tracking when component mounts
  interval?: number; // Interval in milliseconds to send position updates
  useBackgroundTracking?: boolean; // Use background location service (works even when app is closed)
  distanceInterval?: number; // Distance in meters to trigger update (for background tracking)
}

interface UsePositionTrackerReturn {
  isTracking: boolean;
  isBackgroundTracking: boolean;
  location: LocationData | null;
  isLoadingLocation: boolean;
  locationError: string | null;
  isSendingPosition: boolean;
  sendPositionError: string | null;
  lastSentAt: Date | null;
  isMocked: boolean;
  hasBackgroundPermission: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  sendCurrentPosition: () => Promise<void>;
  startBackgroundTracking: () => Promise<boolean>;
  stopBackgroundTracking: () => Promise<boolean>;
  checkBackgroundPermissions: () => Promise<void>;
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
  const {
    autoTrack = false,
    interval = 900000,
    useBackgroundTracking = false,
    distanceInterval = 100
  } = options; // Default 15 minutes

  const [isTracking, setIsTracking] = useState(false);
  const [isBackgroundTracking, setIsBackgroundTracking] = useState(false);
  const [hasBackgroundPermission, setHasBackgroundPermission] = useState(false);
  const [lastSentAt, setLastSentAt] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | number | null>(null);
  const isInitialized = useRef(false);
  const locationRef = useRef<LocationData | null>(null); // Keep location in ref for immediate access

  const {
    location,
    isLoading: isLoadingLocation,
    error: locationError,
    isMocked, // 👈 dari useLocation
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

      if (locationRef.current) {
        console.log("✅ Using cached location from ref");
        return locationRef.current;
      }

      try {
        await getCurrentLocation();

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

    const currentLocation = await getLocationWithTimeout(3000);

    if (!currentLocation) {
      console.log("❌ No location available after timeout, skipping send");
      return false;
    }

    if (currentLocation.mocked) {
      console.log("🚫 Fake GPS detected, skipping send");
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
    await sendPositionRobust();
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
      await startWatchingLocation();
      console.log("📍 Location watching started");

      const initialSuccess = await sendPositionRobust();

      if (initialSuccess) {
        console.log("✅ Initial position sent successfully");
      } else {
        console.log("⚠️ Initial send failed, will retry in first interval");
      }

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

    stopWatchingLocation();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("✅ Interval cleared");
    }
  }, [isTracking, stopWatchingLocation]);

  // Start background tracking
  const startBackgroundTracking = useCallback(async (): Promise<boolean> => {
    console.log("🚀 Starting background location tracking...");

    try {
      const success = await BackgroundLocationService.start({
        accuracy: Location.Accuracy.High,
        timeInterval: interval,
        distanceInterval: distanceInterval,
      });

      if (success) {
        setIsBackgroundTracking(true);
        console.log("✅ Background tracking started successfully");
        return true;
      } else {
        console.error("❌ Failed to start background tracking");
        return false;
      }
    } catch (error) {
      console.error("❌ Error starting background tracking:", error);
      return false;
    }
  }, [interval, distanceInterval]);

  // Stop background tracking
  const stopBackgroundTracking = useCallback(async (): Promise<boolean> => {
    console.log("🛑 Stopping background location tracking...");

    try {
      const success = await BackgroundLocationService.stop();

      if (success) {
        setIsBackgroundTracking(false);
        console.log("✅ Background tracking stopped successfully");
        return true;
      } else {
        console.log("⚠️ Background tracking was not running");
        return false;
      }
    } catch (error) {
      console.error("❌ Error stopping background tracking:", error);
      return false;
    }
  }, []);

  // Check background permissions
  const checkBackgroundPermissions = useCallback(async () => {
    try {
      const permissions = await BackgroundLocationService.checkPermissions();
      const hasPermission =
        permissions.foreground === 'granted' &&
        permissions.background === 'granted';

      setHasBackgroundPermission(hasPermission);

      console.log("📋 Background permissions:", {
        foreground: permissions.foreground,
        background: permissions.background,
        hasFullAccess: hasPermission,
      });
    } catch (error) {
      console.error("❌ Error checking permissions:", error);
      setHasBackgroundPermission(false);
    }
  }, []);

  // Check permissions on mount
  useEffect(() => {
    checkBackgroundPermissions();
  }, [checkBackgroundPermissions]);

  // Check if background tracking is running on mount
  useEffect(() => {
    const checkBackgroundStatus = async () => {
      const isRunning = await BackgroundLocationService.isRunning();
      setIsBackgroundTracking(isRunning);
      console.log("📊 Background tracking status on mount:", isRunning);
    };

    checkBackgroundStatus();
  }, []);

  // Auto-start tracking
  useEffect(() => {
    if (autoTrack && !isInitialized.current) {
      console.log("🚀 Auto-starting position tracking...");
      isInitialized.current = true;

      setTimeout(async () => {
        if (useBackgroundTracking) {
          console.log("📱 Using background tracking mode");
          await startBackgroundTracking();
        } else {
          console.log("📱 Using foreground tracking mode");
          startTracking();
        }
      }, 1000);
    }

    return () => {
      console.log("🧹 Cleanup: stopping tracking");
      if (useBackgroundTracking) {
        stopBackgroundTracking();
      } else {
        stopTracking();
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isTracking,
    isBackgroundTracking,
    location,
    isLoadingLocation,
    locationError,
    isMocked, // 👈 expose biar bisa dipakai di UI
    hasBackgroundPermission,
    isSendingPosition: sendPositionMutation.isPending,
    sendPositionError: sendPositionMutation.error?.message || null,
    lastSentAt,
    startTracking,
    stopTracking,
    sendCurrentPosition,
    startBackgroundTracking,
    stopBackgroundTracking,
    checkBackgroundPermissions,
  };
};
