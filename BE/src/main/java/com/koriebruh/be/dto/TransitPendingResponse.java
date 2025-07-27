package com.koriebruh.be.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransitPendingResponse {

    private String id;

    private String deliveryId;

    private Long transitPointId;

    private Long arrivedAt;
}
