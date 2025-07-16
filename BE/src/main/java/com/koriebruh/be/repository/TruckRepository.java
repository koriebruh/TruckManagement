package com.koriebruh.be.repository;

import com.koriebruh.be.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TruckRepository extends JpaRepository<Truck, String> {

    Boolean existsByLicensePlate(String licensePlate);
}
