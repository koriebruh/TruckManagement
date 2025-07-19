package com.koriebruh.be.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TruckRequest {

    @JsonProperty("licensePlate")
    @NotBlank(message = "License plate is required")
    @Size(max = 20, message = "License plate can't exceed 20 characters")
    private String licensePlate;

    @JsonProperty("model")
    @NotBlank(message = "Model is required")
    @Size(max = 50, message = "Model can't exceed 50 characters")
    private String model;

    @JsonProperty("cargoType")
    @NotBlank(message = "cargoType is required")
    @Size(max = 100, message = "cargoType can't exceed 50 characters")
    private String cargoType;

    @JsonProperty("capacityKG")
    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be greater than 0")
    private Double capacityKG;

    @JsonProperty("isAvailable")
    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;

}
