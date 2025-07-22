package com.koriebruh.be.dto;

import com.koriebruh.be.entity.City;
import jakarta.persistence.ManyToOne;
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

    @NotNull(message = "Loading city ID must not be null")
    @Positive(message = "Loading city ID must be a positive number")
    private Long loadingCityId;

    @NotNull(message = "Unloading city ID must not be null")
    @Positive(message = "Unloading city ID must be a positive number")
    private Long unloadingCityId;

    @NotNull(message = "Estimated duration must not be null")
    @Min(value = 1, message = "Estimated duration must be at least 1 minute")
    private Long estimatedDurationMinute;

    @NotNull(message = "Extra cost must not be null")
    @PositiveOrZero(message = "Extra cost must be zero or positive")
    private Double extraCost;

}
