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

    @NotNull(message = "Start city ID cannot be null")
    private Long startCityId;

    @NotNull(message = "End city ID cannot be null")
    private Long endCityId;

    @Size(max = 255, message = "Details can't exceed 255 characters")
    private String details;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
    private Double basePrice;

    @NotNull(message = "isActive is required")
    private Boolean isActive;
}
