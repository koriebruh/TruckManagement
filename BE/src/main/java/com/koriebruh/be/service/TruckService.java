package com.koriebruh.be.service;

import com.koriebruh.be.dto.TruckRequest;
import com.koriebruh.be.entity.Truck;
import com.koriebruh.be.repository.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public String deleteTruck(String truckId) {
        Truck existingTruck = truckRepository.findById(truckId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Truck not found"));

        existingTruck.setIsAvailable(false); // Set truck as unavailable before deletion
        return "Truck deleted successfully";
    }

    public List<Truck> getAllAvailableTrucks() {
        return truckRepository.findAllByIsAvailableTrue();
    }

    public List<Truck> getAllTrucks() {
        return truckRepository.findAll();
    }
}
