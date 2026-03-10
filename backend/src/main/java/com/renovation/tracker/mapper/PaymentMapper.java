package com.renovation.tracker.mapper;

import com.renovation.tracker.dto.response.PaymentResponse;
import com.renovation.tracker.entity.Expense;
import com.renovation.tracker.entity.Payment;
import com.renovation.tracker.dto.request.PaymentRequest;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public Payment toEntity(PaymentRequest request) {
        Payment payment = new Payment();
        payment.setExpense(new Expense(request.getExpenseId()));
        payment.setDate(request.getDate());
        payment.setAmount(request.getAmount());
        payment.setStatus(request.getStatus());
        payment.setPaymentType(request.getPaymentType());
        return payment;
    }

    public PaymentResponse toResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setExpenseId(payment.getExpense().getId());
        response.setDate(payment.getDate());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());
        response.setPaymentType(payment.getPaymentType());
        return response;
    }
}