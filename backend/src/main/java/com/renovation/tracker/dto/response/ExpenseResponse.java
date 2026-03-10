package com.renovation.tracker.dto.response;

import com.renovation.tracker.entity.enums.ExpenseStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseResponse {

    private Long id;
    private String description;
    private BigDecimal totalAmount;
    private LocalDate expenseDate;
    private LocalDate serviceDeliveryDate;
    private String invoiceImageUrl;
    private ExpenseStatus status;

    // Flattened relationships
    private Long expenseTypeId;
    private String expenseTypeName;
    private Long sponsorId;
    private String sponsorName;
    private Long renovationId;
    private String renovationName;

    // Payment summary
    private BigDecimal totalPaid;
    private BigDecimal totalPending;

}
