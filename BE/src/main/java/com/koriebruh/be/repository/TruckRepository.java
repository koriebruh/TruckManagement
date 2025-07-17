package com.koriebruh.be.repository;

import com.koriebruh.be.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TruckRepository extends JpaRepository<Truck, String> {

    Boolean existsByLicensePlate(String licensePlate);

    List<Truck> findAllByIsAvailableTrue();

    Optional<Truck> findById(String id);
}
