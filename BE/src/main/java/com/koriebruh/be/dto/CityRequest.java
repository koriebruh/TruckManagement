package com.koriebruh.be.dto;


import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class CityRequest {

    @NotBlank(message = "Name must not be blank")
    private String name;

    @NotNull(message = "Latitude must not be null")
    @DecimalMin(value = "-90.0", inclusive = true, message = "Latitude must be at least -90.0")
    @DecimalMax(value = "90.0", inclusive = true, message = "Latitude must be at most 90.0")
    private Double latitude;

    @NotNull(message = "Longitude must not be null")
    @DecimalMin(value = "-180.0", inclusive = true, message = "Longitude must be at least -180.0")
    @DecimalMax(value = "180.0", inclusive = true, message = "Longitude must be at most 180.0")
    private Double longitude;

    @NotBlank(message = "Country must not be blank")
    private String country;


}
