package com.renovation.tracker.controller;

import com.renovation.tracker.dto.request.RenovationRequest;
import com.renovation.tracker.dto.response.RenovationResponse;
import com.renovation.tracker.service.RenovationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/renovations")
@RequiredArgsConstructor
public class RenovationController {

    private final RenovationService service;

    @GetMapping
    public List<RenovationResponse> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RenovationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<RenovationResponse> create(@Valid @RequestBody RenovationRequest request) {
        return ResponseEntity.ok(service.save(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RenovationResponse> update(@PathVariable Long id, @Valid @RequestBody RenovationRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}