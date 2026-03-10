package com.renovation.tracker.controller;

import com.renovation.tracker.dto.response.DashboardResponse;
import com.renovation.tracker.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getSummary() {
        return dashboardService.getSummary();
    }
}