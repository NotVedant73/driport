package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.AdminAnalyticsSummaryDto;
import com.driport.driport_backend.repository.OrderRepository;
import com.driport.driport_backend.service.IAdminAnalyticsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AdminAnalyticsServiceImpl implements IAdminAnalyticsService {

    private final OrderRepository orderRepository;

    public AdminAnalyticsServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public AdminAnalyticsSummaryDto getSummary() {
        AdminAnalyticsSummaryDto dto = new AdminAnalyticsSummaryDto();
        dto.setTotalOrders((int) orderRepository.count());
        dto.setTotalRevenue(orderRepository.sumTotalAmount());
        dto.setPendingOrders((int) orderRepository.countByStatus("PENDING"));
        dto.setDeliveredOrders((int) orderRepository.countByStatus("DELIVERED"));
        return dto;
    }
}
