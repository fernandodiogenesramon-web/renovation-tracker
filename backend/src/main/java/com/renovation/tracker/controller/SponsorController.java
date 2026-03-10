package com.renovation.tracker.controller;


import com.renovation.tracker.dto.request.SponsorRequest;
import com.renovation.tracker.dto.response.SponsorResponse;
import com.renovation.tracker.service.SponsorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sponsors")
@RequiredArgsConstructor
public class SponsorController {

    private final SponsorService service;

    @GetMapping
    public List<SponsorResponse> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SponsorResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<SponsorResponse> create(@Valid @RequestBody SponsorRequest request) {
        return ResponseEntity.ok(service.save(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SponsorResponse> update(@PathVariable Long id, @Valid @RequestBody SponsorRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
