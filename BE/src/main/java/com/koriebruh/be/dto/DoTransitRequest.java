package com.koriebruh.be.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DoTransitRequest {
    @NotBlank(message = "Delivery ID must not be blank")
    private String deliveryId;

    @NotNull(message = "Transit must not be null")
    private Long transitPointId;
}
