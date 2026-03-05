package com.renovation.tracker.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseResponse {

    private Long id;
    private SponsorResponse sponsorResponse;
    private ExpenseTypeResponse expenseTypeResponse;
    private String description;
    private BigDecimal totalAmount;
    private BigDecimal firstInstallment;
    private boolean paidInFull;
    private LocalDate expenseDate;
    private LocalDate paymentDate;
    private LocalDate serviceDeliveryDate;
    private String invoiceImageUrl;

}
