package com.koriebruh.be.repository;

import com.koriebruh.be.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TruckRepository extends JpaRepository<Truck, String> {

    Boolean existsByLicensePlate(String licensePlate);

    List<Truck> findAllByDeletedAtNull();

    Optional<Truck> findById(String id);

    // Query to find all available trucks that are not currently in an active delivery
    @Query(value = """
                SELECT * FROM trucks t
                WHERE t.is_available = true
                AND t.deleted_at IS NULL
                AND t.id NOT IN (
                    SELECT d.truck_id FROM deliveries d
                    WHERE d.finished_at IS NULL
                )
            """, nativeQuery = true)
    List<Truck> findAvailableTrucksNotInActiveDelivery();
}
