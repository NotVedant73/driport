package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AdminAnalyticsSummaryDto;
import com.driport.driport_backend.service.IAdminAnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/admin/analytics")
public class AdminAnalyticsController {

    private final IAdminAnalyticsService adminAnalyticsService;

    public AdminAnalyticsController(IAdminAnalyticsService adminAnalyticsService) {
        this.adminAnalyticsService = adminAnalyticsService;
    }

    @GetMapping("/summary")
    public AdminAnalyticsSummaryDto getSummary() {
        return adminAnalyticsService.getSummary();
    }
}
