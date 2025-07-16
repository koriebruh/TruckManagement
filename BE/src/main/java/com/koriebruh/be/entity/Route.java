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
@Table(name = "routes")
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "start_id", referencedColumnName = "id", nullable = false)
    private City startCity;

    @ManyToOne
    @JoinColumn(name = "end_id", referencedColumnName = "id", nullable = false)
    private City endCity;

    private String details;

    private Double basePrice;

    private Double distanceKM;

    private Double estimatedDurationHours;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;
}
