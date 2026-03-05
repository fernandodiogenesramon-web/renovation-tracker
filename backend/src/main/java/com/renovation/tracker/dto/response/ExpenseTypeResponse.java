package com.renovation.tracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExpenseTypeResponse {

    private Long id;
    private String name;
}
