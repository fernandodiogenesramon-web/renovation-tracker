package com.renovation.tracker.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class DashboardResponse {

    private BudgetSummary budgetSummary;
    private List<StatusSummary> expensesByStatus;
    private List<TypeSummary> expensesByType;
    private List<SponsorSummary> sponsorContributions;

    @Data
    public static class BudgetSummary {
        private BigDecimal totalBudget;
        private BigDecimal totalSpent;
        private BigDecimal totalPaid;
        private BigDecimal totalPending;
    }

    @Data
    public static class StatusSummary {
        private String status;
        private Long count;
        private BigDecimal totalAmount;
    }

    @Data
    public static class TypeSummary {
        private String typeName;
        private Long count;
        private BigDecimal totalAmount;
    }

    @Data
    public static class SponsorSummary {
        private String sponsorName;
        private BigDecimal totalAmount;
        private BigDecimal totalPaid;
    }
}