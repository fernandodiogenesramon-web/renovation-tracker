package com.renovation.tracker.mapper;

import com.renovation.tracker.dto.request.ExpenseRequest;
import com.renovation.tracker.dto.response.ExpenseResponse;
import com.renovation.tracker.entity.Expense;
import com.renovation.tracker.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExpenseMapper {

    private final PaymentRepository paymentRepository;

    public Expense toEntity(ExpenseRequest request) {
        Expense expense = new Expense();
        expense.setDescription(request.getDescription());
        expense.setTotalAmount(request.getTotalAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setServiceDeliveryDate(request.getServiceDeliveryDate());
        expense.setStatus(request.getStatus());
        expense.setInvoiceImageUrl(request.getInvoiceImageUrl());
        // relationships are set in ExpenseService.setRelationships()
        return expense;
    }

    public ExpenseResponse toResponse(Expense expense) {
        ExpenseResponse response = new ExpenseResponse();
        response.setId(expense.getId());
        response.setDescription(expense.getDescription());
        response.setTotalAmount(expense.getTotalAmount());
        response.setExpenseDate(expense.getExpenseDate());
        response.setServiceDeliveryDate(expense.getServiceDeliveryDate());
        response.setInvoiceImageUrl(expense.getInvoiceImageUrl());
        response.setStatus(expense.getStatus());
        response.setExpenseTypeId(expense.getExpenseType().getId());
        response.setExpenseTypeName(expense.getExpenseType().getName());
        response.setSponsorId(expense.getSponsor().getId());
        response.setSponsorName(expense.getSponsor().getName());
        response.setRenovationId(expense.getRenovation().getId());
        response.setRenovationName(expense.getRenovation().getName());
        response.setTotalPaid(paymentRepository.sumPaidByExpenseId(expense.getId()));
        response.setTotalPending(paymentRepository.sumPendingByExpenseId(expense.getId()));
        return response;
    }
}