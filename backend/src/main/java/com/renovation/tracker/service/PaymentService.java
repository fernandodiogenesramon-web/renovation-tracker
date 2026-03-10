package com.renovation.tracker.service;

import com.renovation.tracker.dto.request.PaymentRequest;
import com.renovation.tracker.dto.response.PaymentResponse;
import com.renovation.tracker.entity.Payment;
import com.renovation.tracker.mapper.PaymentMapper;
import com.renovation.tracker.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository repository;
    private final PaymentMapper mapper;

    public List<PaymentResponse> findByExpenseId(Long expenseId) {
        return repository.findByExpenseId(expenseId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public PaymentResponse findById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + id));
    }

    public PaymentResponse save(PaymentRequest request) {
        return mapper.toResponse(repository.save(mapper.toEntity(request)));
    }

    public PaymentResponse update(Long id, PaymentRequest request) {
        Payment existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + id));
        existing.setDate(request.getDate());
        existing.setAmount(request.getAmount());
        existing.setStatus(request.getStatus());
        existing.setPaymentType(request.getPaymentType());
        return mapper.toResponse(repository.save(existing));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}