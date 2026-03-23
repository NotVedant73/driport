package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.AdminOrderDetailDto;
import com.driport.driport_backend.dto.AdminOrderItemDetailDto;
import com.driport.driport_backend.dto.AdminOrderListDto;
import com.driport.driport_backend.dto.AdminOrderStatusUpdateDto;
import com.driport.driport_backend.entiity.Order;
import com.driport.driport_backend.entiity.OrderItem;
import com.driport.driport_backend.exception.ResourceNotFoundException;
import com.driport.driport_backend.repository.OrderRepository;
import com.driport.driport_backend.service.IAdminOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminOrderServiceImpl implements IAdminOrderService {

    private final OrderRepository orderRepository;

    public AdminOrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminOrderListDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AdminOrderDetailDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        return toDetailDto(order);
    }

    @Override
    public void updateOrderStatus(Long id, AdminOrderStatusUpdateDto dto) {
        if (dto.getStatus() == null || dto.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        order.setStatus(dto.getStatus().trim().toUpperCase());
        orderRepository.save(order);
    }

    private AdminOrderListDto toListDto(Order order) {
        AdminOrderListDto dto = new AdminOrderListDto();
        dto.setId(order.getId());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCustomerName(order.getCustomerName());
        dto.setItemCount(order.getItems() != null ? order.getItems().size() : 0);
        return dto;
    }

    private AdminOrderDetailDto toDetailDto(Order order) {
        AdminOrderDetailDto dto = new AdminOrderDetailDto();
        dto.setId(order.getId());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setCustomerPhone(order.getCustomerPhone());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setNotes(order.getNotes());
        dto.setItems(order.getItems().stream()
                .map(this::toItemDetailDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private AdminOrderItemDetailDto toItemDetailDto(OrderItem item) {
        AdminOrderItemDetailDto dto = new AdminOrderItemDetailDto();
        dto.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
        dto.setProductName(item.getProductName());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantity(item.getQuantity());
        dto.setLineTotal(item.getLineTotal());
        return dto;
    }
}
