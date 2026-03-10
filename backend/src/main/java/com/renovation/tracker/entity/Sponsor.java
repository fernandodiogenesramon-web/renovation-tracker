package com.renovation.tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Table(name = "sponsors")
@NoArgsConstructor
public class Sponsor {

    public Sponsor(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "sponsor")
    private List<Expense> expenses;

    @OneToMany(mappedBy = "sponsor")
    private List<RenovationSponsor> renovations;

}
