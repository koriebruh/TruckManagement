package com.koriebruh.be.repository;

import com.koriebruh.be.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, String> {

    Boolean existsByIdAndFinishedAtIsNull(String id);

    List<Delivery> findAllByFinishedAtIsNull();

    Optional<Delivery> findByWorkerIdAndFinishedAtIsNull(String workerId);
}
