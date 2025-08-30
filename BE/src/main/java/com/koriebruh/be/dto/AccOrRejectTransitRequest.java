package com.koriebruh.be.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AccOrRejectTransitRequest {
    @NotBlank(message = "Delivery transit ID must not be blank")
    private String deliveryTransitId;

    @NotNull(message = "Acceptance status (isAccepted) must not be null")
    private Boolean isAccepted;

    @NotBlank(message = "Reason must not be blank")
    private String reason;
}
