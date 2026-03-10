package com.renovation.tracker.dto.response;

import com.renovation.tracker.entity.enums.PaymentStatus;
import com.renovation.tracker.entity.enums.PaymentType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PaymentResponse {

    private Long id;
    private Long expenseId;
    private LocalDate date;
    private BigDecimal amount;
    private PaymentStatus status;
    private PaymentType paymentType;
}