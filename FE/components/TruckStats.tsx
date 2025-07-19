import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TruckStats = ({ statsData} : any) => {
    const router = useRouter();
  return (
    <View className="px-4 py-4">
      <View className="flex-row">
        {statsData.map((stat, index) => (
          <Pressable
            key={index}
            onPress={() => {
              router.push(`/truck`);
            }}
            android_ripple={{ color: "#ccc" }}
            className={`flex-1 p-4 rounded-lg border ${stat.color} ${index !== 0 ? "ml-4" : ""}`}>
            <View className="flex-row items-center mb-2">
              <Text className={`text-sm font-medium ${stat.textColor}`}>
                {stat.title}
              </Text>
              <Ionicons name={stat.icon} size={20} color={stat.iconColor} />
            </View>
            <Text className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default TruckStats