package com.renovation.tracker.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class RenovationResponse {

    public RenovationResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal budget;
    private List<RenovationSponsorResponse> sponsors;
}
