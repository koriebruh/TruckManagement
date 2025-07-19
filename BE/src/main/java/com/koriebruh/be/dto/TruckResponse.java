package com.koriebruh.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TruckResponse {

    private String id;

    private String licensePlate;

    private String model;

    private String cargoType;

    private double capacityKg;

    private Boolean isAvailable;
}
