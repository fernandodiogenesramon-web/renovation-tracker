package com.renovation.tracker.service;

import com.renovation.tracker.dto.response.DashboardResponse;
import com.renovation.tracker.repository.ExpenseRepository;
import com.renovation.tracker.repository.PaymentRepository;
import com.renovation.tracker.repository.RenovationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final PaymentRepository paymentRepository;
    private final RenovationRepository renovationRepository;

    public DashboardResponse getSummary() {
        DashboardResponse response = new DashboardResponse();

        // ── budget summary ───────────────────────────────────────────────────
        DashboardResponse.BudgetSummary budget = new DashboardResponse.BudgetSummary();
        budget.setTotalBudget(renovationRepository.sumTotalBudget());
        budget.setTotalSpent(expenseRepository.sumTotalAmount());
        budget.setTotalPaid(paymentRepository.sumAllPaid());
        budget.setTotalPending(paymentRepository.sumAllPending());
        response.setBudgetSummary(budget);

        // ── expenses by status ───────────────────────────────────────────────
        List<DashboardResponse.StatusSummary> byStatus = expenseRepository.groupByStatus()
                .stream()
                .map(row -> {
                    DashboardResponse.StatusSummary s = new DashboardResponse.StatusSummary();
                    s.setStatus(row[0].toString());
                    s.setCount((Long) row[1]);
                    s.setTotalAmount((BigDecimal) row[2]);
                    return s;
                })
                .toList();
        response.setExpensesByStatus(byStatus);

        // ── expenses by type ─────────────────────────────────────────────────
        List<DashboardResponse.TypeSummary> byType = expenseRepository.groupByType()
                .stream()
                .map(row -> {
                    DashboardResponse.TypeSummary t = new DashboardResponse.TypeSummary();
                    t.setTypeName(row[0].toString());
                    t.setCount((Long) row[1]);
                    t.setTotalAmount((BigDecimal) row[2]);
                    return t;
                })
                .toList();
        response.setExpensesByType(byType);

        // ── sponsor contributions ────────────────────────────────────────────
        // total spent per sponsor from expenses
        Map<String, BigDecimal> spentBySponsor = expenseRepository.groupBySponsor()
                .stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> (BigDecimal) row[1]
                ));

        // total paid per sponsor from payments
        Map<String, BigDecimal> paidBySponsor = paymentRepository.sumPaidGroupedBySponsor()
                .stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> (BigDecimal) row[1]
                ));

        List<DashboardResponse.SponsorSummary> sponsors = spentBySponsor.entrySet()
                .stream()
                .map(entry -> {
                    DashboardResponse.SponsorSummary s = new DashboardResponse.SponsorSummary();
                    s.setSponsorName(entry.getKey());
                    s.setTotalAmount(entry.getValue());
                    s.setTotalPaid(paidBySponsor.getOrDefault(entry.getKey(), BigDecimal.ZERO));
                    return s;
                })
                .toList();
        response.setSponsorContributions(sponsors);

        return response;
    }
}