package com.renovation.tracker.entity;

import com.renovation.tracker.entity.enums.ExpenseStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "expenses")
@NoArgsConstructor
public class Expense {

    public Expense(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private LocalDate expenseDate;

    @Column(nullable = false)
    private LocalDate serviceDeliveryDate;

    @Column(name = "invoice_image_url", length = 500)
    private String invoiceImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "expense_type_id", nullable = false)
    private ExpenseType expenseType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sponsor_id", nullable = false)
    private Sponsor sponsor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renovation_id", nullable = false)
    private Renovation renovation;

    @OneToMany(mappedBy = "expense")
    private List<Payment> payments;
}