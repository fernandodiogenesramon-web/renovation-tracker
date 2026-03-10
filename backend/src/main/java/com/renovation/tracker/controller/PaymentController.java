package com.renovation.tracker.controller;

import com.renovation.tracker.dto.request.PaymentRequest;
import com.renovation.tracker.dto.response.PaymentResponse;
import com.renovation.tracker.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses/{expenseId}/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    @GetMapping
    public List<PaymentResponse> getAll(@PathVariable Long expenseId) {
        return service.findByExpenseId(expenseId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getById(@PathVariable Long expenseId, @PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> create(@PathVariable Long expenseId, @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(service.save(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> update(@PathVariable Long expenseId, @PathVariable Long id, @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long expenseId, @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
