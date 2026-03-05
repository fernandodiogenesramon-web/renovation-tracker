package com.renovation.tracker.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column
    private BigDecimal firstInstallment;

    @Column(nullable = false)
    private boolean paidInFull;

    @Column(nullable = false)
    private LocalDate expenseDate;

    @Column(nullable = false)
    private LocalDate paymentDate;

    @Column(nullable = false)
    private LocalDate serviceDeliveryDate;

    @Column(name = "invoice_image_url", length = 500)
    private String invoiceImageUrl;

    @JoinColumn
    @ManyToOne
    private ExpenseType expenseType;

    @JoinColumn
    @ManyToOne
    private Sponsor sponsor;
}