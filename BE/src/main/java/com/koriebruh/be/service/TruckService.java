package com.koriebruh.be.service;

import com.koriebruh.be.dto.TruckRequest;
import com.koriebruh.be.dto.TruckResponse;
import com.koriebruh.be.entity.Truck;
import com.koriebruh.be.repository.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class TruckService {

    @Autowired
    private TruckRepository truckRepository;

    public String createTruck(TruckRequest request) {
        // Check if license plate already exists
        if (truckRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "License plate already exists");
        }

        Truck newTruck = new Truck();
        newTruck.setLicensePlate(request.getLicensePlate());
        newTruck.setModel(request.getModel());
        newTruck.setCargoType(request.getCargoType());
        newTruck.setCapacityKG(request.getCapacityKG());
        newTruck.setIsAvailable(request.getIsAvailable());
        truckRepository.save(newTruck);

        return "Truck created successfully";
    }

    public String updateTruck(String truckId, TruckRequest request) {
        Truck existingTruck = truckRepository.findById(truckId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Truck not found"));

        // Update fields
        existingTruck.setLicensePlate(request.getLicensePlate());
        existingTruck.setModel(request.getModel());
        existingTruck.setCargoType(request.getCargoType());
        existingTruck.setCapacityKG(request.getCapacityKG());
        existingTruck.setIsAvailable(request.getIsAvailable());
        truckRepository.save(existingTruck);

        return "Truck updated successfully";
    }

    public Truck getTruckById(String truckId) {
        return truckRepository.findById(truckId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Truck not found"));
    }


    public String setMaintenanceTruck(String truckId) {
        Truck existingTruck = truckRepository.findById(truckId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Truck not found"));

        existingTruck.setIsAvailable(false); // set maintenance
        truckRepository.save(existingTruck);
        return "Truck set to maintenance successfully";
    }

    public String deleteTruck(String truckId) {
        Truck existingTruck = truckRepository.findById(truckId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Truck not found"));

        existingTruck.setDeletedAt(Instant.now().getEpochSecond());
        truckRepository.save(existingTruck);
        return "Truck deleted successfully";
    }

    /* Available, means is not used in delivery and not IsAvailable  status is true
     * */
    public List<TruckResponse> getAllAvailableTrucks() {
        List<Truck> activeDelivery = truckRepository.findAvailableTrucksNotInActiveDelivery();
        if (activeDelivery.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No available trucks found all trucks are in active delivery");
        }

        return activeDelivery.stream()
                .map(truck -> TruckResponse.builder()
                        .id(truck.getId())
                        .licensePlate(truck.getLicensePlate())
                        .model(truck.getModel())
                        .cargoType(truck.getCargoType())
                        .capacityKG(truck.getCapacityKG())
                        .isAvailable(truck.getIsAvailable())
                        .build())
                .toList();
    }

    // Get all trucks, yang penting belum di delete
    public List<TruckResponse> getAllTrucks() {
        List<Truck> trucks = truckRepository.findAllByDeletedAtNull();
        ;
        return trucks.stream()
                .map(truck -> TruckResponse.builder()
                        .id(truck.getId())
                        .licensePlate(truck.getLicensePlate())
                        .model(truck.getModel())
                        .cargoType(truck.getCargoType())
                        .capacityKG(truck.getCapacityKG())
                        .isAvailable(truck.getIsAvailable())
                        .build())
                .toList();
    }

    // History Delivery By Truck id
    // latter add
}
