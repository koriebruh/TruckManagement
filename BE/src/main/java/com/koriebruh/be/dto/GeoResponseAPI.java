package com.koriebruh.be.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class GeoResponseAPI {
    // MAIN
    private String type;
    private List<Feature> features;
    private Query query;

    /**/
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Feature {
        private String type;
        private Properties properties;
        private Geometry geometry;
        private List<Double> bbox;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Properties {
        private Map<String, Object> datasource;
        private String name;
        private String country;
        private String country_code;
        private String state;
        private String city;
        private String postcode;
        private String district;
        private String suburb;
        private String street;
        private String housenumber;
        private String iso3166_2;
        private double lon;
        private double lat;
        private String state_code;
        private double distance;
        private String result_type;
        private String formatted;
        private String address_line1;
        private String address_line2;
        private String category;
        private Map<String, Object> timezone;
        private String plus_code;
        private Map<String, Object> rank;
        private String place_id;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Geometry {
        private String type;
        private List<Double> coordinates;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Query {
        private double lat;
        private double lon;
        private String plus_code;
    }
}

