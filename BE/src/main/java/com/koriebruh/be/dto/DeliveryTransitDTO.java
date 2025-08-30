package com.koriebruh.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeliveryTransitDTO {
    private String id;
    private TransitPointResponse transitPoint;
    private Long arrivedAt;
    private Boolean isAccepted;
    private String reason;
    private Long actionedAt;
    private String actionByOperatorId;
}
