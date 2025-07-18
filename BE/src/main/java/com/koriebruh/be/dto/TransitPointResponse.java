package com.koriebruh.be.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransitPointResponse {

    private Long id;

    private String cityName;

    // estimation duration IN this location
    private Long estimatedDurationMinute;

    private Double extraCost;

    private Double latitude;

    private Double longitude;

}
