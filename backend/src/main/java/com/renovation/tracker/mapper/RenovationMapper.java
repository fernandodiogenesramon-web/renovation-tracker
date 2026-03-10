package com.renovation.tracker.mapper;

import com.renovation.tracker.dto.request.RenovationRequest;
import com.renovation.tracker.dto.response.RenovationResponse;
import com.renovation.tracker.entity.Renovation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RenovationMapper {

    private final RenovationSponsorMapper renovationSponsorMapper;

    public Renovation toEntity(RenovationRequest request) {
        Renovation renovation = new Renovation();
        renovation.setName(request.getName());
        renovation.setDescription(request.getDescription());
        renovation.setStartDate(request.getStartDate());
        renovation.setEndDate(request.getEndDate());
        renovation.setBudget(request.getBudget());
        return renovation;
    }

    public RenovationResponse toResponse(Renovation renovation) {
        RenovationResponse response = new RenovationResponse();
        response.setId(renovation.getId());
        response.setName(renovation.getName());
        response.setDescription(renovation.getDescription());
        response.setStartDate(renovation.getStartDate());
        response.setEndDate(renovation.getEndDate());
        response.setBudget(renovation.getBudget());
        response.setSponsors(
                renovation.getSponsors() == null ? Collections.emptyList() :
                        renovation.getSponsors()
                                .stream()
                                .map(renovationSponsorMapper::toResponse)
                                .collect(Collectors.toList())
        );
        return response;
    }
}
