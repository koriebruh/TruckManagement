package com.koriebruh.be.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DeliveryRequest {

    @NotNull(message = "Truck ID must not be null")
    private String truckId;

    @NotNull(message = "Route ID must not be null")
    private String routeId;

    @NotNull(message = "Worker ID must not be null")
    private String workerId;

}
