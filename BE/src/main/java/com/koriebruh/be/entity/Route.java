package com.koriebruh.be.entity;

import com.koriebruh.be.entity.Enum.RouteStatusType;
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
    private Cities startCity;

    @ManyToOne
    @JoinColumn(name = "end_id", referencedColumnName = "id", nullable = false)
    private Cities endCity;

    private Float basePrice;

    private Float distanceKM;

    private Long estimatedDurationHours;

    @Enumerated(EnumType.STRING)
    private RouteStatusType status; // e.g., "active", "inactive", "archived"

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;
}
