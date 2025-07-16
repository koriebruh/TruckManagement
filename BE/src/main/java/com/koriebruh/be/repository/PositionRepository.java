package com.koriebruh.be.repository;

import com.koriebruh.be.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<Position, Long> {

    // Custom query methods can be added here if needed
    // For example, to find positions by delivery ID or within a certain time range

//    Position findTopByTruckIdOrderByCreatedAtDesc(String truckId);

//    Position getCreatedAt(String truckId) ;
}
