package com.koriebruh.be.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DoTransitRequest {
    @NotBlank(message = "Delivery ID must not be blank")
    private String deliveryId;

    @NotBlank(message = "Transit Point ID must not be blank")
    private Long transitPointId;
}
