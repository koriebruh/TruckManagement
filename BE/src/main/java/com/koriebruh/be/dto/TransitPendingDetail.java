package com.koriebruh.be.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransitPendingDetail {

    private String id;

    private String deliveryId;

    private Long transitPointId;

    private Long arrivedAt;

    private String ActionByOperatorId;

    private Boolean isAccepted;

    private Long actionedAt;

    private String reason;
}
