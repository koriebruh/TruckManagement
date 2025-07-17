package com.koriebruh.be.repository;

import com.koriebruh.be.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {

    // Custom query methods can be added here if needed
    // For example, to find cities by name or within a certain region
    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);
}
