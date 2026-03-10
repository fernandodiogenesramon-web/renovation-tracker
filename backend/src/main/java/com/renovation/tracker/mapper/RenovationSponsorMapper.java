package com.renovation.tracker.mapper;

import com.renovation.tracker.dto.response.RenovationSponsorResponse;
import com.renovation.tracker.entity.RenovationSponsor;
import org.springframework.stereotype.Component;

@Component
public class RenovationSponsorMapper {

    public RenovationSponsorResponse toResponse(RenovationSponsor renovationSponsor) {
        RenovationSponsorResponse response = new RenovationSponsorResponse();
        response.setId(renovationSponsor.getId());
        response.setSponsorId(renovationSponsor.getSponsor().getId());
        response.setSponsorName(renovationSponsor.getSponsor().getName());
        response.setParticipationPercentage(renovationSponsor.getParticipationPercentage());
        return response;
    }
}
