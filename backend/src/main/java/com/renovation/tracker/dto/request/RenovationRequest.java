package com.renovation.tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RenovationRequest {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private BigDecimal budget;

    private LocalDate endDate;
}
