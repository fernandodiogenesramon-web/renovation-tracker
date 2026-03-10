package com.renovation.tracker.service;

import com.renovation.tracker.dto.request.ExpenseTypeRequest;
import com.renovation.tracker.dto.response.ExpenseTypeResponse;
import com.renovation.tracker.entity.ExpenseType;
import com.renovation.tracker.mapper.ExpenseTypeMapper;
import com.renovation.tracker.repository.ExpenseTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseTypeService {

    private final ExpenseTypeRepository repository;
    private final ExpenseTypeMapper mapper;

    public List<ExpenseTypeResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public ExpenseTypeResponse findById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("ExpenseType not found: " + id));
    }

    public ExpenseTypeResponse save(ExpenseTypeRequest request) {
        return mapper.toResponse(repository.save(mapper.toEntity(request)));
    }

    public ExpenseTypeResponse update(Long id, ExpenseTypeRequest request) {
        ExpenseType existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExpenseType not found: " + id));
        existing.setName(request.getName());
        return mapper.toResponse(repository.save(existing));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}