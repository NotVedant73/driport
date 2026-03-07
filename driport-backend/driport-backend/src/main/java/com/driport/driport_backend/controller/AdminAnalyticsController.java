package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AdminAnalyticsSummaryDto;
import com.driport.driport_backend.entiity.Order;
import com.driport.driport_backend.repository.OrderRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("api/v1/admin/analytics")
public class AdminAnalyticsController {

    private final OrderRepository orderRepository;

    public AdminAnalyticsController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/summary")
    public AdminAnalyticsSummaryDto getSummary() {
        List<Order> orders = orderRepository.findAll();

        BigDecimal revenue = BigDecimal.ZERO;
        int pending = 0;
        int delivered = 0;

        for (Order o : orders) {
            if (o.getTotalAmount() != null) {
                revenue = revenue.add(o.getTotalAmount());
            }
            if (o.getStatus() != null) {
                String s = o.getStatus().trim().toUpperCase();
                if ("PENDING".equals(s)) pending++;
                if ("DELIVERED".equals(s)) delivered++;
            }
        }

        AdminAnalyticsSummaryDto dto = new AdminAnalyticsSummaryDto();
        dto.setTotalRevenue(revenue);
        dto.setTotalOrders(orders.size());
        dto.setPendingOrders(pending);
        dto.setDeliveredOrders(delivered);
        return dto;
    }
}

