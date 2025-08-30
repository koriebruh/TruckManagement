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
public class GeoResponseAPIBatch {
    // Query information
    private Query query;

    // Datasource information
    private Datasource datasource;

    // Location details
    private String name;
    private String country;
    private String country_code;
    private String region;
    private String state;
    private String city;
    private String village;
    private String postcode;
    private String district;
    private String suburb;
    private String city_block;
    private String neighbourhood;
    private String street;
    private String housenumber;
    private String iso3166_2;
    private String iso3166_2_sublevel;

    // Coordinates
    private double lon;
    private double lat;

    // Administrative codes
    private String county;
    private String state_code;
    private String county_code;

    // Result metadata
    private double distance;
    private String result_type;
    private String formatted;
    private String address_line1;
    private String address_line2;
    private String category;

    // Additional information
    private Timezone timezone;
    private String plus_code;
    private String plus_code_short;
    private Rank rank;
    private String place_id;

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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Datasource {
        private String sourcename;
        private String attribution;
        private String license;
        private String url;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Timezone {
        private String name;
        private String offset_STD;
        private int offset_STD_seconds;
        private String offset_DST;
        private int offset_DST_seconds;
        private String abbreviation_STD;
        private String abbreviation_DST;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Rank {
        private double importance;
        private double popularity;
    }
}