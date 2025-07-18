package com.koriebruh.be.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransitPointRequest {

    @NotBlank(message = "City name must not be blank")
    private String cityName;

    @NotNull(message = "Estimated duration must not be null")
    @Min(value = 1, message = "Estimated duration must be at least 1 minute")
    private Long estimatedDurationMinute;

    @NotNull(message = "Extra cost must not be null")
    @PositiveOrZero(message = "Extra cost must be zero or positive")
    private Double extraCost;

    @NotNull(message = "Latitude must not be null")
    @DecimalMin(value = "-90.0", inclusive = true, message = "Latitude must be at least -90.0")
    @DecimalMax(value = "90.0", inclusive = true, message = "Latitude must be at most 90.0")
    private Double latitude;

    @NotNull(message = "Longitude must not be null")
    @DecimalMin(value = "-180.0", inclusive = true, message = "Longitude must be at least -180.0")
    @DecimalMax(value = "180.0", inclusive = true, message = "Longitude must be at most 180.0")
    private Double longitude;

}
