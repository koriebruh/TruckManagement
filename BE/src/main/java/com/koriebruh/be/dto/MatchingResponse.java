package com.koriebruh.be.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MatchingResponse {
    private String code;
    private List<Matching> matchings;
    private List<Tracepoint> tracepoints;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Matching {
        private String geometry;
        private Double distance;
        private Double duration;
        private Double confidence;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Tracepoint {
        private String name;
        private List<Double> location;
        
        @JsonProperty("matchings_index")
        private Integer matchingsIndex;
        
        @JsonProperty("waypoint_index")
        private Integer waypointIndex;
    }
}
