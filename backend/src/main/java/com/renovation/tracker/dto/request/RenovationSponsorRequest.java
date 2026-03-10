package com.renovation.tracker.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RenovationSponsorRequest {

    @NotNull
    private Long sponsorId;

    @NotNull
    private BigDecimal participationPercentage;
}
