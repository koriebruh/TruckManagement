// // app/city/index.tsx
// import React from "react";
// import { View, Text, ScrollView, ActivityIndicator } from "react-native";
// import { useCities } from "@/hooks/useCities";

// const CityPage = () => {
//   const { cities, isLoading, isError, refetchCities } = useCities();

//   if (isLoading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Memuat data kota...</Text>
//       </View>
//     );
//   }

//   if (isError) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <Text className="text-red-500 font-semibold">
//           Gagal memuat data kota.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-white p-4">
//       <Text className="text-xl font-bold mb-4">Daftar Kota</Text>
//       {cities?.length === 0 ? (
//         <Text>Tidak ada data kota.</Text>
//       ) : (
//         cities.map((city) => (
//           <View
//             key={city.id}
//             className="mb-3 p-3 rounded-xl bg-gray-100 shadow-sm">
//             <Text className="text-base font-semibold">{city.name}</Text>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// export default CityPage;
