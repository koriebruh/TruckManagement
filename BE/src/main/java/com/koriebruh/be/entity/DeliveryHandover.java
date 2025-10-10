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
@Table(name = "delivery_handovers")
public class DeliveryHandover {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_id", nullable = false)
    private Delivery delivery;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_worker_id")
    private User fromWorker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_worker_id", nullable = false)
    private User toWorker;

    @Column(name = "handover_at", nullable = false)
    private Long handoverAt;

    @Column(name = "reason")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "action_by_operator_id", nullable = true)
    private User actionByOperatorId;
}
