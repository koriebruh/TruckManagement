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
@Table(name = "transit_points")
public class TransitPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String cityName;

    private Long estimatedDurationMinute;

    private Float extraCost;

    private Double latitude;

    private Double longitude;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;

}
