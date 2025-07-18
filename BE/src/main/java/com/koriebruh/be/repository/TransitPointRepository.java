package com.koriebruh.be.repository;

import com.koriebruh.be.entity.TransitPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface TransitPointRepository extends JpaRepository<TransitPoint, Long> {

    List<TransitPoint> findAllByDeletedAtNull();
}
