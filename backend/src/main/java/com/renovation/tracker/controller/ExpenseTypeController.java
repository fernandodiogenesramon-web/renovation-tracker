package com.renovation.tracker.controller;

import com.renovation.tracker.dto.request.ExpenseTypeRequest;
import com.renovation.tracker.dto.response.ExpenseTypeResponse;
import com.renovation.tracker.service.ExpenseTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expense-types")
@RequiredArgsConstructor
public class ExpenseTypeController {

    private final ExpenseTypeService service;

    @GetMapping
    public List<ExpenseTypeResponse> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseTypeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ExpenseTypeResponse> create(@Valid @RequestBody ExpenseTypeRequest request) {
        return ResponseEntity.ok(service.save(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseTypeResponse> update(@PathVariable Long id, @Valid @RequestBody ExpenseTypeRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
