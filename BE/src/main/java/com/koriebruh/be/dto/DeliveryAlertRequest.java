package com.koriebruh.be.dto;

import com.koriebruh.be.entity.Enum.DeliverAlertType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DeliveryAlertRequest {

    @NotNull(message = "Alert type is required")
    private DeliverAlertType type;

    @NotBlank(message = "Message is required")
    private String message;

    private String deliveryId;
}
