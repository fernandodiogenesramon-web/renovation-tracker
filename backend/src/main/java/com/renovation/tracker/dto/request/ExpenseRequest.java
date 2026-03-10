package com.renovation.tracker.dto.request;

import com.renovation.tracker.entity.enums.ExpenseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseRequest {

    @NotBlank
    private String description;

    @NotNull
    private Long sponsorId;

    @NotNull
    private Long expenseTypeId;

    @NotNull
    private Long renovationId;

    @NotNull
    @Positive
    private BigDecimal totalAmount;

    @NotNull
    private LocalDate expenseDate;

    @NotNull
    private LocalDate serviceDeliveryDate;

    private String invoiceImageUrl;

    @NotNull
    private ExpenseStatus status;
}
