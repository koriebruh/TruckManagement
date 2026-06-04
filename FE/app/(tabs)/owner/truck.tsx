import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import {
  useTrucks,
  useCreateTruck,
  useUpdateTruck,
  useDeleteTruck,
  useToggleTruckAvailability,
  CreateTruckData,
  UpdateTruckData,
  Truck,
} from "@/hooks/useTrucks";

const TruckManagement = () => {
  const insets = useSafeAreaInsets();
  const {
    data: trucksData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useTrucks();

  const createTruckMutation = useCreateTruck();
  const updateTruckMutation = useUpdateTruck();
  const deleteTruckMutation = useDeleteTruck();
  const toggleAvailabilityMutation = useToggleTruckAvailability();

  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateTruckData>({
    license_plate: "",
    model: "",
    capacity_kg: 0,
    cargo_type: "",
    is_available: true,
  });

  const handleRefresh = () => {
    refetch();
  };

  const resetForm = () => {
    setFormData({
      license_plate: "",
      model: "",
      capacity_kg: 0,
      cargo_type: "",
      is_available: true,
    });
  };

  const handleCreateTruck = async () => {
    if (
      !formData.license_plate ||
      !formData.model ||
      !formData.capacity_kg ||
      !formData.cargo_type ||
      !formData.is_available
    ) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }

    try {
      await createTruckMutation.mutateAsync(formData);
      Alert.alert("Sukses", "Truck berhasil ditambahkan!");
      setIsCreateModalVisible(false);
      resetForm();
    } catch (err) {
      Alert.alert("Error", "Gagal menambahkan truck!");
      console.error(err);
    }
  };

  const handleEditTruck = async () => {
    if (!selectedTruck) return;

    const updateData: UpdateTruckData = {
      license_plate: formData.license_plate,
      model: formData.model,
      capacity_kg: formData.capacity_kg,
      cargo_type: formData.cargo_type,
      is_available: formData.is_available,
    };

    try {
      await updateTruckMutation.mutateAsync({
        truckId: selectedTruck.id,
        data: updateData,
      });
      Alert.alert("Sukses", "Truck berhasil diupdate!");
      setIsEditModalVisible(false);
      setSelectedTruck(null);
      resetForm();
    } catch (err) {
      Alert.alert("Error", "Gagal mengupdate truck!");
      console.error(err);
    }
  };

  const handleDeleteTruck = (truck: Truck) => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus truck ${truck.license_plate}?`,
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTruckMutation.mutateAsync(truck.id);
              Alert.alert("Sukses", "Truck berhasil dihapus!");
            } catch (err) {
              Alert.alert("Error", "Gagal menghapus truck!");
              console.error(err);
            }
          },
        },
      ]
    );
  };

  const handleToggleAvailability = async (truck: Truck) => {
    try {
      await toggleAvailabilityMutation.mutateAsync(truck.id);
    } catch (err) {https://www.figma.com/design/qfH0RHg4ttO1ImDwQujhak/Nowted-%E2%80%93%C2%A0A-Note-taking-App--Community-?node-id=18-2122&p=f&t=CmoBMSE1AwksYFKQ-0
      Alert.alert("Error", "Gagal mengubah status ketersediaan truck!");
      console.error(err);
    }
  };

  const openEditModal = (truck: Truck) => {
    setSelectedTruck(truck);
    setFormData({
      license_plate: truck.license_plate,
      model: truck.model,
      capacity_kg: truck.capacity_kg,
      cargo_type: truck.cargo_type,
      is_available: truck.is_available,
    });
    setIsEditModalVisible(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalVisible(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-500 mt-4">Memuat data truck...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text className="text-gray-800 text-lg font-semibold mt-4 text-center">
            Gagal Memuat Data
          </Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">
            Terjadi kesalahan saat mengambil data truck
          </Text>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3 rounded-xl"
            onPress={handleRefresh}>
            <Text className="text-white font-semibold">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const trucks = trucksData?.data || [];
  const availableTrucks = trucks.filter((t) => t.is_available && !t.deleted_at);

  return (
    <View
      style={{ marginBottom: insets.bottom }}
      className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Stats Cards */}
      <View className="px-6 py-4">
        <View className="flex-row justify-between">
          <View className="bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-500 text-sm">Total Truck</Text>
                <Text className="text-2xl font-bold text-gray-800 mt-1">
                  {trucks.filter((t) => !t.deleted_at).length}
                </Text>
              </View>
              <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center">
                <Ionicons name="car" size={24} color="#3B82F6" />
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-500 text-sm">Tersedia</Text>
                <Text className="text-2xl font-bold text-green-600 mt-1">
                  {availableTrucks.length}
                </Text>
              </View>
              <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
          />
        }>
        {/* Header with Add Button */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">
            Daftar Truck
          </Text>
          <TouchableOpacity
            onPress={openCreateModal}
            className="bg-blue-600 px-4 py-2 rounded-xl flex-row items-center">
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-1">Tambah</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        {trucks.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
            <Ionicons name="car-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              Belum Ada Truck
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Tambahkan truck pertama Anda dengan menekan tombol Tambah
            </Text>
          </View>
        ) : (
          trucks
            .filter((t) => !t.deleted_at)
            .map((truck) => (
              <View
                key={truck.id}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    {/* License Plate */}
                    <View className="flex-row items-center mb-2">
                      <View className="bg-blue-100 px-3 py-1 rounded-lg">
                        <Text className="text-blue-800 font-bold text-base">
                          {truck.license_plate}
                        </Text>
                      </View>
                      {truck.is_available ? (
                        <View className="bg-green-100 px-3 py-1 rounded-lg ml-2">
                          <Text className="text-green-800 font-semibold text-xs">
                            Tersedia
                          </Text>
                        </View>
                      ) : (
                        <View className="bg-orange-100 px-3 py-1 rounded-lg ml-2">
                          <Text className="text-orange-800 font-semibold text-xs">
                            Maintenance
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Model */}
                    <Text className="text-gray-800 font-semibold text-lg mb-3">
                      {truck.model}
                    </Text>

                    {/* Details */}
                    <View className="space-y-2">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="cube-outline"
                          size={16}
                          color="#6B7280"
                        />
                        <Text className="text-gray-600 ml-2">
                          Kapasitas: {truck.capacity_kg.toLocaleString()} kg
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons
                          name="list-outline"
                          size={16}
                          color="#6B7280"
                        />
                        <Text className="text-gray-600 ml-2">
                          Tipe Kargo: {truck.cargo_type}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="ml-2">
                    <TouchableOpacity
                      onPress={() => openEditModal(truck)}
                      className="bg-blue-100 p-2 rounded-lg mb-2">
                      <Ionicons name="create-outline" size={20} color="#2563EB" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleToggleAvailability(truck)}
                      className={`${
                        truck.is_available ? "bg-orange-100" : "bg-green-100"
                      } p-2 rounded-lg mb-2`}>
                      <Ionicons
                        name={truck.is_available ? "pause" : "play"}
                        size={20}
                        color={truck.is_available ? "#F97316" : "#10B981"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteTruck(truck)}
                      className="bg-red-100 p-2 rounded-lg">
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreateModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Tambah Truck Baru
              </Text>
              <TouchableOpacity
                onPress={() => setIsCreateModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* License Plate */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Plat Nomor
                </Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800"
                  placeholder="Contoh: B 1234 ABC"
                  value={formData.license_plate}
                  onChangeText={(text) =>
                    setFormData({ ...formData, license_plate: text })
                  }
                />
              </View>

              {/* Model */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">Model</Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800"
                  placeholder="Contoh: Hino Ranger"
                  value={formData.model}
                  onChangeText={(text) =>
                    setFormData({ ...formData, model: text })
                  }
                />
              </View>

              {/* Capacity */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Kapasitas (kg)
                </Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800"
                  placeholder="Contoh: 5000"
                  keyboardType="numeric"
                  value={formData.capacity_kg.toString()}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      capacity_kg: parseInt(text) || 0,
                    })
                  }
                />
              </View>

              {/* Cargo Type */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2">
                  Tipe Kargo
                </Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800"
                  placeholder="Contoh: General Cargo"
                  value={formData.cargo_type}
                  onChangeText={(text) =>
                    setFormData({ ...formData, cargo_type: text })
                  }
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleCreateTruck}
                disabled={createTruckMutation.isPending}
                className="bg-blue-600 py-4 rounded-xl items-center mb-4">
                {createTruckMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Tambah Truck
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Edit Truck
              </Text>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* License Plate */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Plat Nomor
                </Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800"
                  placeholder="Contoh: B 1234 ABC"
                  value={formData.license_plate}
                  onChangeText={(text) =>
                    setFormData({ ...formData, license_plate: text })
                  }
                />
              </View>

              {/* Model */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">Model</Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800"
                  placeholder="Contoh: Hino Ranger"
                  value={formData.model}
                  onChangeText={(text) =>
                    setFormData({ ...formData, model: text })
                  }
                />
              </View>

              {/* Capacity */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Kapasitas (kg)
                </Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800"
                  placeholder="Contoh: 5000"
                  keyboardType="numeric"
                  value={formData.capacity_kg.toString()}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      capacity_kg: parseInt(text) || 0,
                    })
                  }
                />
              </View>

              {/* Cargo Type */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Tipe Kargo
                </Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800"
                  placeholder="Contoh: General Cargo"
                  value={formData.cargo_type}
                  onChangeText={(text) =>
                    setFormData({ ...formData, cargo_type: text })
                  }
                />
              </View>

              {/* Availability Status */}
              <View className="mb-6 bg-gray-100 px-4 py-3 rounded-xl">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-gray-700 font-semibold">
                      Status Ketersediaan
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      {formData.is_available ? "Tersedia" : "Tidak Tersedia"}
                    </Text>
                  </View>
                  <Switch
                    value={formData.is_available}
                    onValueChange={(value) =>
                      setFormData({ ...formData, is_available: value })
                    }
                    trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                    thumbColor={formData.is_available ? "#2563EB" : "#F3F4F6"}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleEditTruck}
                disabled={updateTruckMutation.isPending}
                className="bg-blue-600 py-4 rounded-xl items-center mb-4">
                {updateTruckMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Update Truck
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TruckManagement;
