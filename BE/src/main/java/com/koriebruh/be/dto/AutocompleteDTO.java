package com.koriebruh.be.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AutocompleteDTO {
    @JsonProperty("place_id")
    private String placeId;
    
    @JsonProperty("osm_id")
    private String osmId;
    
    @JsonProperty("osm_type")
    private String osmType;
    
    @JsonProperty("display_name")
    private String displayName;
    
    private String lat;
    private String lon;
    
    private Address address;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Address {
        private String name;
        private String road;
        private String suburb;
        private String city;
        private String state;
        private String country;
    }
}
