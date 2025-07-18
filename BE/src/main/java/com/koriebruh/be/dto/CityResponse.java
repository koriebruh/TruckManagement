package com.koriebruh.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CityResponse {

    private Long id;

    private String name;

    private Double latitude;

    private Double longitude;

    private String country;

}
