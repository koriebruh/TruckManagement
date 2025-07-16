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
@Table(name = "deliver_alerts")
public class DeliverAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "delivery_id", nullable = false)
    @JsonIgnore
    private Delivery delivery;

    private String message;

    @Column(name = "created_at", nullable = false)
    private Long createdAt;

}
/*
* This Entity represents an alert for a delivery. where got anomaly like
* Stay in one place for too long, or not moving at all.
* */