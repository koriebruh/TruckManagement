package com.koriebruh.be.repository;

import com.koriebruh.be.entity.DeliveryHandover;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryHandoverRepository extends JpaRepository<DeliveryHandover, Long> {

    List<DeliveryHandover> findAllByDeliveryIdOrderByHandoverAtDesc(String deliveryId);

}
