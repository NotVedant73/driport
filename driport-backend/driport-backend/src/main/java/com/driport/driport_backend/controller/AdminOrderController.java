package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AdminOrderDetailDto;
import com.driport.driport_backend.dto.AdminOrderListDto;
import com.driport.driport_backend.dto.AdminOrderStatusUpdateDto;
import com.driport.driport_backend.service.IAdminOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/admin/orders")
public class AdminOrderController {

    private final IAdminOrderService adminOrderService;

    public AdminOrderController(IAdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    @GetMapping
    public List<AdminOrderListDto> getOrders() {
        return adminOrderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminOrderDetailDto> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(adminOrderService.getOrderById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id,
            @RequestBody AdminOrderStatusUpdateDto dto) {
        adminOrderService.updateOrderStatus(id, dto);
        return ResponseEntity.noContent().build();
    }
}
