package com.renovation.tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ExpenseTypeRequest {

    @NotBlank
    private String name;
}
