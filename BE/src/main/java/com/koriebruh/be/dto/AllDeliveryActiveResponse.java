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
@Builder
@Data
public class AllDeliveryActiveResponse {
    private String id;

    private String workerId;

    private String truckId;

    private String routeId;

    private Long startedAt;
}
