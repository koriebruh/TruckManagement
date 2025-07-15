package com.koriebruh.be.entity;

import com.koriebruh.be.entity.Enum.DeliveryStatusType;
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
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "truck_id")
    private Truck trucks;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private User worker;

    @Enumerated(EnumType.STRING)
    private DeliveryStatusType deliveryStatus;

    @Column(name = "starte_at", nullable = false, updatable = false)
    private Long startedAt;

    @Column(name = "finished_at")
    private Long finishedAt;
}
