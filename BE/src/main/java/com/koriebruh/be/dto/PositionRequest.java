package com.koriebruh.be.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionRequest {

    @NotNull(message = "Latitude tidak boleh kosong")
    @DecimalMin(value = "-90.0", inclusive = true, message = "Latitude harus ≥ -90")
    @DecimalMax(value = "90.0", inclusive = true, message = "Latitude harus ≤ 90")
    private Double latitude;

    @NotNull(message = "Longitude tidak boleh kosong")
    @DecimalMin(value = "-180.0", inclusive = true, message = "Longitude harus ≥ -180")
    @DecimalMax(value = "180.0", inclusive = true, message = "Longitude harus ≤ 180")
    private Double longitude;
}
