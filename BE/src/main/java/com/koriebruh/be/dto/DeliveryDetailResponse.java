package com.koriebruh.be.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DeliveryDetailResponse {

    private String id;

    private String workerId;

    private String truckId;

    private String routeId;

    private String addByOperatorId;

    private Long startedAt;

    private Long finishedAt;

    private List<DeliveryTransitDTO> transits;

    private List<DeliveryAlertDTO> alerts;

}
