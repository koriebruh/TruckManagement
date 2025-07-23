package com.koriebruh.be.repository;

import com.koriebruh.be.entity.DeliverAlert;
import com.koriebruh.be.entity.Enum.DeliverAlertType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliverAlertRepository extends JpaRepository<DeliverAlert, String> {

    // Additional query methods can be defined here if needed
    // For example, to find deliveries by status, date, or other criteria

    DeliverAlert findTopByDeliveryIdOrderByCreatedAtDesc(String deliveryId);

    DeliverAlert findTopByDeliveryIdAndTypeOrderByCreatedAtDesc(String deliveryId, DeliverAlertType type);

    void deleteAllByDeliveryId(String deliveryId);
}
