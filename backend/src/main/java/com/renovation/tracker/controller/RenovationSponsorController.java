package com.renovation.tracker.controller;

import com.renovation.tracker.dto.request.RenovationSponsorRequest;
import com.renovation.tracker.dto.response.RenovationSponsorResponse;
import com.renovation.tracker.service.RenovationSponsorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/renovations/{renovationId}/sponsors")
@RequiredArgsConstructor
public class RenovationSponsorController {

    private final RenovationSponsorService service;

    @GetMapping
    public List<RenovationSponsorResponse> getAll(@PathVariable Long renovationId) {
        return service.findByRenovationId(renovationId);
    }

    @PostMapping
    public ResponseEntity<RenovationSponsorResponse> add(
            @PathVariable Long renovationId,
            @Valid @RequestBody RenovationSponsorRequest request) {
        return ResponseEntity.ok(service.addSponsor(renovationId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RenovationSponsorResponse> update(
            @PathVariable Long renovationId,
            @PathVariable Long id,
            @Valid @RequestBody RenovationSponsorRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long renovationId,
            @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}