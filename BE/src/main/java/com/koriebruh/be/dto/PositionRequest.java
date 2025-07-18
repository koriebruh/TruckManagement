package com.koriebruh.be.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionRequest {

    @NotNull(message = "Delivery ID must not be null")
    private String deliveryId;

    @NotNull(message = "Latitude must not be null")
    @DecimalMin(value = "-90.0", inclusive = true, message = "Latitude must be at least -90.0")
    @DecimalMax(value = "90.0", inclusive = true, message = "Latitude must be at most 90.0")
    private Double latitude;

    @NotNull(message = "Longitude must not be null")
    @DecimalMin(value = "-180.0", inclusive = true, message = "Longitude must be at least -180.0")
    @DecimalMax(value = "180.0", inclusive = true, message = "Longitude must be at most 180.0")
    private Double longitude;

    @NotNull(message = "recordedAt must not be null")
    @Positive(message = "recordedAt must be a positive timestamp (epoch time)")
    private Long recordedAt;
}
