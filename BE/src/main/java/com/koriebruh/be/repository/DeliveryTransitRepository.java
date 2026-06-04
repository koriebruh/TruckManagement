package com.koriebruh.be.repository;

import com.koriebruh.be.entity.DeliveryTransit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryTransitRepository extends JpaRepository<DeliveryTransit, String> {

    // Additional query methods can be defined here if needed
    // For example, to find deliveries by status, date, or other criteria
    DeliveryTransit findTopByDeliveryIdOrderByArrivedAtDesc(String deliveryId);

    void deleteAllByDeliveryId(String deliveryId);


    List<DeliveryTransit> findAllByIsAcceptedNullAndActionByOperatorIdNull();

//    DeliveryTransit findTopByDeliveryIdAndTransitPointIdLoadingCityIdAndIsAcceptedTrueOrderByArrivedAtDesc(String id, Long id1);
}
