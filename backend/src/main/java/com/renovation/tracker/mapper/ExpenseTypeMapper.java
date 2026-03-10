package com.renovation.tracker.mapper;

import com.renovation.tracker.dto.request.ExpenseTypeRequest;
import com.renovation.tracker.dto.response.ExpenseTypeResponse;
import com.renovation.tracker.entity.ExpenseType;
import org.springframework.stereotype.Component;

@Component
public class ExpenseTypeMapper {

    public ExpenseType toEntity(ExpenseTypeRequest request) {
        ExpenseType expenseType = new ExpenseType();
        expenseType.setName(request.getName());
        return expenseType;
    }

    public ExpenseTypeResponse toResponse(ExpenseType expenseType) {
        ExpenseTypeResponse expenseTypeResponse = new ExpenseTypeResponse();
        expenseTypeResponse.setId(expenseType.getId());
        expenseTypeResponse.setName(expenseType.getName());
        return expenseTypeResponse;
    }
}
