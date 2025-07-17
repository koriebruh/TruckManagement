import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TruckList = ({ trackingData}: any) => {
  const router = useRouter();

  return (
    <View className="px-4">
      {trackingData.map((item ) => (
        <Pressable
          onPress={() => router.push(`/truck/${item.id}`)}
          key={item.id}
          className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View
                  className={`w-3 h-3 rounded-full ${item.statusColor} mr-2`}
                />
                <Text className="text-sm font-medium text-gray-600">
                  {item.status}
                </Text>
              </View>
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {item.route}
              </Text>
              {item.driver && (
                <View className="flex-row items-center mb-1">
                  <Ionicons name="person" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">{item.driver}</Text>
                </View>
              )}
              {item.time && (
                <View className="flex-row items-center">
                  <Ionicons name="time" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">Mulai: {item.time}</Text>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

export default TruckList