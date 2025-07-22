import React from "react";
import { useCities } from "@/hooks/useCities";
import { Text, View } from "react-native";

const CityList = () => {
  const {
    cities,
    isLoading,
    isError,
    refetchCities,
    createCity,
    updateCity,
    deleteCity,
  } = useCities();

  return (
    <View>
      {isLoading && <Text>Loading...</Text>}
      {isError && <Text>Error loading cities</Text>}
      {cities?.map((city) => (
        <Text key={city.id}>{city.name}</Text>
      ))}
    </View>
  );
};
