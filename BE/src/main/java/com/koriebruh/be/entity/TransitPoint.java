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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "loading_city_id", referencedColumnName = "id", nullable = false)
    private City loadingCity;

    @ManyToOne
    @JoinColumn(name = "unloading_city_id", referencedColumnName = "id", nullable = false)
    private City unloadingCity;

    // estimation duration IN this location
    private Long estimatedDurationMinute;

    private Double extraCost;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
