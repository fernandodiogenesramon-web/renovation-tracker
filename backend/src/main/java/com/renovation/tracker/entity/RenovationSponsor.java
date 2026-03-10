package com.renovation.tracker.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "renovation_sponsors")
public class RenovationSponsor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renovation_id", nullable = false)
    private Renovation renovation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sponsor_id", nullable = false)
    private Sponsor sponsor;

    @Column(nullable = false)
    private BigDecimal participationPercentage;  // e.g. 60.00, 40.00
}
