package com.renovation.tracker.service;

import com.renovation.tracker.dto.request.ExpenseRequest;
import com.renovation.tracker.dto.response.ExpenseResponse;
import com.renovation.tracker.entity.Expense;
import com.renovation.tracker.entity.ExpenseType;
import com.renovation.tracker.entity.Sponsor;
import com.renovation.tracker.mapper.ExpenseMapper;
import com.renovation.tracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository repository;
    private final ExpenseMapper expenseMapper;

    public List<ExpenseResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    public ExpenseResponse findById(Long id) {
        return repository.findById(id)
                .map(expenseMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Expense not found: " + id));
    }

    public ExpenseResponse save(ExpenseRequest expenseRequest) {
        Expense expense = expenseMapper.toEntity(expenseRequest);
        return expenseMapper.toResponse(repository.save(expense));
    }

    public ExpenseResponse update(Long id, ExpenseRequest updatedRequest) {
        Expense expense = repository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found: " + id));;
        expense.setDescription(updatedRequest.getDescription());
        expense.setTotalAmount(updatedRequest.getTotalAmount());
        expense.setPaidInFull(updatedRequest.isPaidInFull());
        expense.setFirstInstallment(updatedRequest.getFirstInstallment());
        expense.setExpenseDate(updatedRequest.getExpenseDate());
        expense.setPaymentDate(updatedRequest.getPaymentDate());
        expense.setServiceDeliveryDate(updatedRequest.getServiceDeliveryDate());
        expense.setInvoiceImageUrl(updatedRequest.getInvoiceImageUrl());
        expense.setExpenseType(new ExpenseType(updatedRequest.getExpenseTypeId()));
        expense.setSponsor(new Sponsor(updatedRequest.getExpenseTypeId()));
        return expenseMapper.toResponse(repository.save(expense));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
