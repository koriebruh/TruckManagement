package com.koriebruh.be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "delivery_transits")
public class DeliveryTransit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "delivery_id")
    @JsonIgnore
    private Delivery delivery;

    @ManyToOne
    @JoinColumn(name = "transit_point_id")
    private TransitPoint transitPoint;

    // time dimana user melakukan request untuk transit ini
    @Column(name = "arrived_at", nullable = false, updatable = false)
    private Long arrivedAt;

    @ManyToOne(optional = true)
    @JoinColumn(name = "action_by_operator_id", nullable = true)
    private User ActionByOperatorId;

    @Column(name = "is_accepted", nullable = true)
    private Boolean isAccepted;

    @Column(name = "actioned_at", nullable = true, updatable = false)
    private Long actionedAt;

    @Column(name = "reason", nullable = true)
    private String reason;
}
