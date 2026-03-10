package com.renovation.tracker.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RenovationSponsorResponse {

    private Long id;
    private Long sponsorId;
    private String sponsorName;
    private BigDecimal participationPercentage;
}
