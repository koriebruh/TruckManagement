package com.koriebruh.be.dto;


import com.koriebruh.be.entity.DeliverAlert;
import com.koriebruh.be.entity.DeliveryTransit;
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

    private ProfileResponse worker;

    private TruckResponse truck;

    private RouteResponse route;

    private Long startedAt;

    private Long finishedAt;

    private List<DeliverAlert> alerts;

    private List<DeliveryTransit> transits;
}
