package com.koriebruh.be.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PositionGeoResponse {

    private Double latitude;

    private Double longitude;

    private String name;

    @JsonProperty("formatted_address")
    private String formatedAddress;

    private String city;

    private String state;

    private String country;

    @JsonProperty("plus_code")
    private String plusCode;

    @JsonProperty("recorded_at")
    private Long recordedAt;
}
