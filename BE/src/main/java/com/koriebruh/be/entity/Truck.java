package com.koriebruh.be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "trucks")
public class Truck {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String licensePlate;

    private String model;

    // is jenis muatan
    private String CargoType;

    private double capacityKG;

    /*AVALIABEL INI MAKSUDNYA TRUCK NYA ADA TIDAK SEDANG MAINTANECE ATAU APA GITU
     * */
    private Boolean isAvailable;
}
