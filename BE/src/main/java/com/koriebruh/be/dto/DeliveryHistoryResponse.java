package com.koriebruh.be.dto;

import com.koriebruh.be.entity.Route;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryHistoryResponse {

    private String id;

    private String workerId;

    private String truckId;

    private String routeId;

    private Long startedAt;

    private Long finishedAt;

    private String addByOperatorId;
}
