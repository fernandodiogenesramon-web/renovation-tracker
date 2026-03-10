package com.renovation.tracker.service;

import com.renovation.tracker.dto.request.SponsorRequest;
import com.renovation.tracker.dto.response.SponsorResponse;
import com.renovation.tracker.entity.Sponsor;
import com.renovation.tracker.mapper.SponsorMapper;
import com.renovation.tracker.repository.SponsorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SponsorService {

    private final SponsorRepository repository;
    private final SponsorMapper mapper;

    public List<SponsorResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public SponsorResponse findById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Sponsor not found: " + id));
    }

    public SponsorResponse save(SponsorRequest request) {
        return mapper.toResponse(repository.save(mapper.toEntity(request)));
    }

    public SponsorResponse update(Long id, SponsorRequest request) {
        Sponsor existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sponsor not found: " + id));
        existing.setName(request.getName());
        return mapper.toResponse(repository.save(existing));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
