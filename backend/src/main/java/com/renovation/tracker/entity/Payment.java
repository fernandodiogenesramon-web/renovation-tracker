package com.renovation.tracker.entity;

import com.renovation.tracker.entity.enums.PaymentStatus;
import com.renovation.tracker.entity.enums.PaymentType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType paymentType;
}