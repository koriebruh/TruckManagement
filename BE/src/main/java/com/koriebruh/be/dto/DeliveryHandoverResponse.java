package com.koriebruh.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DeliveryHandoverResponse {
    private String deliveryId;

    private String fromWorker;

    private String toWorker;

    private Long handoverAt;

    private String reason;

    private String actionByOperator;

}
