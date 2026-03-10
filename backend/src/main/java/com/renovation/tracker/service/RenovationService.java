package com.renovation.tracker.service;

import com.renovation.tracker.dto.request.RenovationRequest;
import com.renovation.tracker.dto.response.RenovationResponse;
import com.renovation.tracker.entity.Renovation;
import com.renovation.tracker.mapper.RenovationMapper;
import com.renovation.tracker.repository.RenovationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RenovationService {

    private final RenovationRepository repository;
    private final RenovationMapper mapper;

    public List<RenovationResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public RenovationResponse findById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Renovation not found: " + id));
    }

    public RenovationResponse save(RenovationRequest request) {
        return mapper.toResponse(repository.save(mapper.toEntity(request)));
    }

    public RenovationResponse update(Long id, RenovationRequest request) {
        Renovation existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Renovation not found: " + id));
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setStartDate(request.getStartDate());
        existing.setEndDate(request.getEndDate());
        existing.setBudget(request.getBudget());
        return mapper.toResponse(repository.save(existing));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
