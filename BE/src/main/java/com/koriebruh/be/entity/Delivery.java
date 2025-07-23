package com.koriebruh.be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

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

    @Column(name = "started_at", nullable = false, updatable = false)
    private Long startedAt;

    @Column(name = "finished_at")
    private Long finishedAt;

    @ManyToOne(optional = true)
    @JoinColumn(name = "add_by_operator_id", nullable = true)
    private User addByOperatorId;

    // satu delivery bisa memiliki banyak alert
    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeliverAlert> alerts = new ArrayList<>();

    // satu delivery bisa memiliki banyak transit
    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeliveryTransit> transits = new ArrayList<>();

}
