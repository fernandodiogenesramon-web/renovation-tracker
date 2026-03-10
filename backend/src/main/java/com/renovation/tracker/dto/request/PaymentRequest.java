package com.renovation.tracker.dto.request;

import com.renovation.tracker.entity.enums.PaymentStatus;
import com.renovation.tracker.entity.enums.PaymentType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PaymentRequest {

    @NotNull
    private Long expenseId;

    @NotNull
    private LocalDate date;

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotNull
    private PaymentStatus status;

    @NotNull
    private PaymentType paymentType;
}