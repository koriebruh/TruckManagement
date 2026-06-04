package com.koriebruh.be.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RouteRequest {

    private Long startCityId;
    private String startCityName;
    private Double startCityLat;
    private Double startCityLon;

    private Long endCityId;
    private String endCityName;
    private Double endCityLat;
    private Double endCityLon;

    @Size(max = 255, message = "Details can't exceed 255 characters")
    private String details;

    @NotBlank(message = "Cargo type is required")
    private String cargoType;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
    private Double basePrice;

    @NotNull(message = "isActive is required")
    private Boolean isActive;

    public RouteRequest(Long startCityId, Long endCityId, String details, String cargoType, Double basePrice,
            Boolean isActive) {
        this.startCityId = startCityId;
        this.endCityId = endCityId;
        this.details = details;
        this.cargoType = cargoType;
        this.basePrice = basePrice;
        this.isActive = isActive;
    }
}
