// components/TrackingControl.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuthenticatedTracking } from '@/hooks/useAuthenticatedTracking';

/**
 * Component untuk control background tracking
 * - Terintegrasi dengan authentication
 * - Auto-start setelah login
 * - Auto-stop setelah logout
 * - Persistent state (tracking tetap aktif setelah restart)
 */
export const TrackingControl = () => {
  const {
    isTracking,
    isLoading,
    hasPermission,
    error,
    startTracking,
    stopTracking,
    requestPermissions,
  } = useAuthenticatedTracking({
    autoStart: true, // Auto-start setelah login
    interval: 900000, // 15 menit (dalam milliseconds)
    distanceInterval: 100, // 100 meter
  });

  const handleToggleTracking = async () => {
    if (isTracking) {
      // Confirm stop tracking
      Alert.alert(
        'Stop Tracking',
        'Are you sure you want to stop location tracking?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Stop',
            style: 'destructive',
            onPress: async () => {
              const success = await stopTracking();
              if (success) {
                Alert.alert('Success', 'Tracking stopped successfully');
              }
            },
          },
        ]
      );
    } else {
      // Check permissions first
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'To track deliveries, we need access to your location even when the app is in the background.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Grant Permission',
              onPress: async () => {
                const granted = await requestPermissions();
                if (granted) {
                  await startTracking();
                }
              },
            },
          ]
        );
      } else {
        const success = await startTracking();
        if (success) {
          Alert.alert(
            'Tracking Started',
            'Your location will be sent every 15 minutes or every 100 meters, even when the app is closed.'
          );
        }
      }
    }
  };

  return (
    <View className="bg-white rounded-lg p-4 shadow-sm">
      {/* Status Section */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Location Tracking
        </Text>

        <View className="flex-row items-center mb-2">
          <View
            className={`w-3 h-3 rounded-full mr-2 ${
              isTracking ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <Text className="text-gray-700">
            Status: {isTracking ? 'Active' : 'Inactive'}
          </Text>
        </View>

        {isTracking && (
          <Text className="text-sm text-gray-500">
            📍 Sending location every 15 minutes
          </Text>
        )}

        {!hasPermission && !isTracking && (
          <View className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
            <Text className="text-sm text-yellow-800">
              ⚠️ Background location permission required
            </Text>
          </View>
        )}

        {error && (
          <View className="bg-red-50 border border-red-200 rounded p-2 mt-2">
            <Text className="text-sm text-red-800">{error}</Text>
          </View>
        )}
      </View>

      {/* Control Button */}
      <TouchableOpacity
        onPress={handleToggleTracking}
        disabled={isLoading}
        className={`py-3 px-4 rounded-lg ${
          isTracking
            ? 'bg-red-500'
            : hasPermission
            ? 'bg-blue-500'
            : 'bg-gray-400'
        } ${isLoading ? 'opacity-50' : ''}`}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white text-center font-semibold">
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Info Section */}
      <View className="mt-4 pt-4 border-t border-gray-200">
        <Text className="text-xs text-gray-500 mb-1">
          • Location sent every 15 minutes or 100 meters
        </Text>
        <Text className="text-xs text-gray-500 mb-1">
          • Works even when app is closed
        </Text>
        <Text className="text-xs text-gray-500 mb-1">
          • Fake GPS detection enabled
        </Text>
        <Text className="text-xs text-gray-500">
          • Auto-starts after login
        </Text>
      </View>
    </View>
  );
};
