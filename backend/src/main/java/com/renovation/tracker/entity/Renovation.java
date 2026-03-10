package com.renovation.tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "renovations")
@NoArgsConstructor
public class Renovation {

    public Renovation(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column(nullable = false)
    private BigDecimal budget;

    @OneToMany(mappedBy = "renovation")
    private List<Expense> expenses;

    @OneToMany(mappedBy = "renovation")
    private List<RenovationSponsor> sponsors;
}
