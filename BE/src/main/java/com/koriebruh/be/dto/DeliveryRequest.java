package com.koriebruh.be.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DeliveryRequest {

    @NotNull(message = "Truck ID must not be null")
    private String truckId;

    @NotNull(message = "Route ID must not be null")
    private String routeId;

    @NotNull(message = "Route ID must not be null")
    private String workerId;

    @NotNull(message = "Latitude must not be null")
    @DecimalMin(value = "-90.0", inclusive = true, message = "Latitude must be at least -90.0")
    @DecimalMax(value = "90.0", inclusive = true, message = "Latitude must be at most 90.0")
    private Double latitude;

    @NotNull(message = "Longitude must not be null")
    @DecimalMin(value = "-180.0", inclusive = true, message = "Longitude must be at least -180.0")
    @DecimalMax(value = "180.0", inclusive = true, message = "Longitude must be at most 180.0")
    private Double longitude;
}
