package com.renovation.tracker.service;

import com.renovation.tracker.dto.request.RenovationSponsorRequest;
import com.renovation.tracker.dto.response.RenovationSponsorResponse;
import com.renovation.tracker.entity.Renovation;
import com.renovation.tracker.entity.RenovationSponsor;
import com.renovation.tracker.entity.Sponsor;
import com.renovation.tracker.mapper.RenovationSponsorMapper;
import com.renovation.tracker.repository.RenovationRepository;
import com.renovation.tracker.repository.RenovationSponsorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RenovationSponsorService {

    private final RenovationSponsorRepository repository;
    private final RenovationRepository renovationRepository;
    private final RenovationSponsorMapper mapper;

    public List<RenovationSponsorResponse> findByRenovationId(Long renovationId) {
        return repository.findByRenovationId(renovationId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public RenovationSponsorResponse addSponsor(Long renovationId, RenovationSponsorRequest request) {
        Renovation renovation = renovationRepository.findById(renovationId)
                .orElseThrow(() -> new RuntimeException("Renovation not found: " + renovationId));

        RenovationSponsor renovationSponsor = new RenovationSponsor();
        renovationSponsor.setRenovation(renovation);
        renovationSponsor.setSponsor(new Sponsor(request.getSponsorId()));
        renovationSponsor.setParticipationPercentage(request.getParticipationPercentage());

        return mapper.toResponse(repository.save(renovationSponsor));
    }

    public RenovationSponsorResponse update(Long id, RenovationSponsorRequest request) {
        RenovationSponsor existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("RenovationSponsor not found: " + id));
        existing.setSponsor(new Sponsor(request.getSponsorId()));
        existing.setParticipationPercentage(request.getParticipationPercentage());
        return mapper.toResponse(repository.save(existing));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
