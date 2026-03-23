package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.AdminOrderDetailDto;
import com.driport.driport_backend.dto.AdminOrderListDto;
import com.driport.driport_backend.dto.AdminOrderStatusUpdateDto;

import java.util.List;

public interface IAdminOrderService {
    List<AdminOrderListDto> getAllOrders();

    AdminOrderDetailDto getOrderById(Long id);

    void updateOrderStatus(Long id, AdminOrderStatusUpdateDto dto);
}
