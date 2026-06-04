package com.koriebruh.be.dto;

import com.koriebruh.be.entity.City;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RouteResponse {

    private String id;

    private String startCityName;
    private Double startCityLat;
    private Double startCityLon;

    private String endCityName;
    private Double endCityLat;
    private Double endCityLon;

    private String details;

    private String cargoType;

    private Double basePrice;

    private Double distanceKM;

    private Double estimatedDurationHours;

    private Boolean isActive;

    private Long createdAt;
}
