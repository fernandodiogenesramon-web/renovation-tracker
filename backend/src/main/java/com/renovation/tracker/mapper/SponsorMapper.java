package com.renovation.tracker.mapper;

import com.renovation.tracker.dto.request.SponsorRequest;
import com.renovation.tracker.dto.response.SponsorResponse;
import com.renovation.tracker.entity.Sponsor;
import org.springframework.stereotype.Component;

@Component
public class SponsorMapper {

    public Sponsor toEntity(SponsorRequest request) {
        Sponsor sponsor = new Sponsor();
        sponsor.setName(request.getName());
        return sponsor;
    }

    public SponsorResponse toResponse(Sponsor sponsor) {
        SponsorResponse sponsorResponse = new SponsorResponse();
        sponsorResponse.setId(sponsor.getId());
        sponsorResponse.setName(sponsor.getName());
        return sponsorResponse;
    }
}
