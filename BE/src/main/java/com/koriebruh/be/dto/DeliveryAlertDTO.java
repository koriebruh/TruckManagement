package com.koriebruh.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DeliveryAlertDTO {
    private String id;
    private String type;
    private String message;
    private Long createdAt;
}
