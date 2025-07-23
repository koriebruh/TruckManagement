package com.koriebruh.be.repository;

import com.koriebruh.be.entity.DeliveryTransit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryTransitRepository extends JpaRepository<DeliveryTransit, String> {

    // Additional query methods can be defined here if needed
    // For example, to find deliveries by status, date, or other criteria
    DeliveryTransit findTopByDeliveryIdOrderByArrivedAtDesc(String deliveryId);

    void deleteAllByDeliveryId(String deliveryId);
}
