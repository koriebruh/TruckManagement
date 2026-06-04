import { useEffect, useCallback, useState, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { BackgroundLocationService } from '@/services/backgroundLocationService';
import { TrackingStateService } from '@/services/trackingStateService';
import * as Location from 'expo-location';

interface UseAuthenticatedTrackingOptions {
  autoStart?: boolean; // Auto-start tracking setelah login
  interval?: number; // 15 menit default
  distanceInterval?: number; // 100 meter default
}

interface UseAuthenticatedTrackingReturn {
  isTracking: boolean;
  isLoading: boolean;
  hasPermission: boolean;
  error: string | null;
  startTracking: () => Promise<boolean>;
  stopTracking: () => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;
}

/**
 * Hook untuk manage background tracking dengan authentication
 * - Otomatis start tracking setelah login
 * - Otomatis stop tracking setelah logout
 * - Restore tracking state setelah app restart
 */
export const useAuthenticatedTracking = (
  options: UseAuthenticatedTrackingOptions = {}
): UseAuthenticatedTrackingReturn => {
  const {
    autoStart = true,
    interval = 900000, // 15 minutes
    distanceInterval = 100, // 100 meter
  } = options;

  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Request location permissions
   */
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      console.log('📱 Requesting location permissions...');

      // Request foreground permission
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus !== 'granted') {
        setError('Foreground location permission not granted');
        setHasPermission(false);
        return false;
      }

      // Request background permission
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

      if (backgroundStatus !== 'granted') {
        setError('Background location permission not granted');
        setHasPermission(false);
        return false;
      }

      console.log('✅ All location permissions granted');
      setHasPermission(true);
      setError(null);
      return true;
    } catch (err) {
      console.error('❌ Error requesting permissions:', err);
      setError('Failed to request permissions');
      return false;
    }
  }, []);

  /**
   * Start background tracking
   */
  const startTracking = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🚀 Starting authenticated tracking...');

      // Check authentication
      if (!isAuthenticated) {
        setError('User must be logged in to start tracking');
        console.warn('⚠️ Cannot start tracking: User not authenticated');
        return false;
      }

      // Check permissions
      if (!hasPermission) {
        const granted = await requestPermissions();
        if (!granted) {
          return false;
        }
      }

      // Save tracking config
      await TrackingStateService.saveTrackingConfig({
        interval,
        distanceInterval,
      });

      // Start background location service
      const success = await BackgroundLocationService.start({
        accuracy: Location.Accuracy.High,
        timeInterval: interval,
        distanceInterval: distanceInterval,
      });

      if (success) {
        // Save tracking state
        await TrackingStateService.setActive();
        setIsTracking(true);
        console.log('✅ Authenticated tracking started successfully');
        return true;
      } else {
        setError('Failed to start background location service');
        console.error('❌ Failed to start background location service');
        return false;
      }
    } catch (err) {
      console.error('❌ Error starting tracking:', err);
      setError('Failed to start tracking');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasPermission, interval, distanceInterval, requestPermissions]);

  /**
   * Stop background tracking
   */
  const stopTracking = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🛑 Stopping authenticated tracking...');

      // Stop background location service
      const success = await BackgroundLocationService.stop();

      if (success || true) {
        // Always update state even if service wasn't running
        await TrackingStateService.setInactive();
        setIsTracking(false);
        console.log('✅ Authenticated tracking stopped successfully');
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Error stopping tracking:', err);
      setError('Failed to stop tracking');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  /**
   * AppState listener to send position INSTANTLY when app goes to background (Home button)
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log('📱 App has come to the background! Triggering instant update...');
        
        // Only force update if we are authenticated and tracking is supposed to be active
        if (isAuthenticated && isTracking) {
          await BackgroundLocationService.sendSingleUpdate();
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      // console.log('📊 AppState changed to:', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, isTracking]);

  /**
   * Check and restore tracking state on mount
   */
  useEffect(() => {
    const initializeTracking = async () => {
      try {
        setIsLoading(true);

        // Check permissions first
        const foreground = await Location.getForegroundPermissionsAsync();
        const background = await Location.getBackgroundPermissionsAsync();
        const hasAllPermissions =
          foreground.status === 'granted' && background.status === 'granted';

        setHasPermission(hasAllPermissions);

        // Check if tracking is currently running
        const isRunning = await BackgroundLocationService.isRunning();
        setIsTracking(isRunning);

        console.log('📊 Tracking initialization:', {
          isRunning,
          hasPermissions: hasAllPermissions,
          isAuthenticated,
        });

        // If authenticated and tracking should be active, restore it
        if (isAuthenticated && hasAllPermissions && !authLoading) {
          const shouldBeTracking = await TrackingStateService.shouldBeTracking();

          if (shouldBeTracking && !isRunning && autoStart) {
            console.log('🔄 Restoring tracking state after app restart...');
            await startTracking();
          }
        }
      } catch (err) {
        console.error('❌ Error initializing tracking:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      initializeTracking();
    }
  }, [isAuthenticated, authLoading]);

  /**
   * Auto-stop tracking on logout
   */
  useEffect(() => {
    const handleLogout = async () => {
      if (!isAuthenticated && isTracking) {
        console.log('🔒 User logged out, stopping tracking...');
        await stopTracking();
      }
    };

    handleLogout();
  }, [isAuthenticated, isTracking, stopTracking]);

  return {
    isTracking,
    isLoading,
    hasPermission,
    error,
    startTracking,
    stopTracking,
    requestPermissions,
  };
};
