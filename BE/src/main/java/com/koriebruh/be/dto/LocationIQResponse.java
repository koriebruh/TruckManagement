package com.koriebruh.be.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class LocationIQResponse {

    @JsonProperty("place_id")
    private String placeId;

    private String licence;

    private String lat;

    private String lon;

    @JsonProperty("display_name")
    private String displayName;

    private Address address;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Address {
        private String road;
        private String suburb;
        private String city;
        private String county;
        private String state;
        private String postcode;
        private String country;
        
        @JsonProperty("country_code")
        private String countryCode;
        
        private String borough;
        private String neighbourhood;
        private String village;
        
        @JsonProperty("house_number")
        private String houseNumber;
    }
}
