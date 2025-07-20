package com.koriebruh.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PositionResponse {
    private Double latitude;

    private Double longitude;

    private Long recordedAt;
}