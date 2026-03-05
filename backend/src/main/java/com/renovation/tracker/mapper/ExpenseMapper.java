package com.renovation.tracker.mapper;

import com.renovation.tracker.dto.request.ExpenseRequest;
import com.renovation.tracker.dto.response.ExpenseResponse;
import com.renovation.tracker.dto.response.ExpenseTypeResponse;
import com.renovation.tracker.dto.response.SponsorResponse;
import com.renovation.tracker.entity.Expense;
import com.renovation.tracker.entity.ExpenseType;
import com.renovation.tracker.entity.Sponsor;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public Expense toEntity(ExpenseRequest request) {
        Expense expense = new Expense();
        expense.setDescription(request.getDescription());
        expense.setTotalAmount(request.getTotalAmount());
        expense.setPaidInFull(request.isPaidInFull());
        expense.setFirstInstallment(request.getFirstInstallment());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setPaymentDate(request.getPaymentDate());
        expense.setServiceDeliveryDate(request.getServiceDeliveryDate());
        expense.setInvoiceImageUrl(request.getInvoiceImageUrl());
        expense.setExpenseType(new ExpenseType(request.getExpenseTypeId()));
        expense.setSponsor(new Sponsor(request.getExpenseTypeId()));
        return expense;
    }

    public ExpenseResponse toResponse(Expense expense) {
        ExpenseResponse response = new ExpenseResponse();
        response.setId(expense.getId());
        response.setDescription(expense.getDescription());
        response.setTotalAmount(expense.getTotalAmount());
        response.setFirstInstallment(expense.getFirstInstallment());
        response.setPaidInFull(expense.isPaidInFull());
        response.setPaymentDate(expense.getPaymentDate());
        response.setExpenseDate(expense.getExpenseDate());
        response.setServiceDeliveryDate(expense.getServiceDeliveryDate());
        response.setInvoiceImageUrl(expense.getInvoiceImageUrl());
        response.setExpenseTypeResponse(new ExpenseTypeResponse(expense.getExpenseType().getId(), expense.getExpenseType().getName()));
        response.setSponsorResponse(new SponsorResponse(expense.getSponsor().getId(), expense.getSponsor().getName()));
        return response;
    }
}
