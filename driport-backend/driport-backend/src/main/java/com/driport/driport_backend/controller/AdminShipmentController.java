package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AdminCreateShipmentDto;
import com.driport.driport_backend.dto.AdminShipmentEventCreateDto;
import com.driport.driport_backend.dto.AdminShipmentStatusUpdateDto;
import com.driport.driport_backend.dto.LowStockProductDto;
import com.driport.driport_backend.dto.ShipmentDto;
import com.driport.driport_backend.dto.ShipmentEventDto;
import com.driport.driport_backend.service.IShipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/admin/shipments")
public class AdminShipmentController {

    private final IShipmentService shipmentService;

    public AdminShipmentController(IShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @GetMapping
    public List<ShipmentDto> getAllShipments() {
        return shipmentService.getAllShipments();
    }

    @PostMapping
    public ResponseEntity<ShipmentDto> createShipment(@RequestBody AdminCreateShipmentDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shipmentService.createShipment(dto));
    }

    @PatchMapping("/{shipmentId}/status")
    public ResponseEntity<ShipmentDto> updateShipmentStatus(@PathVariable Long shipmentId,
            @RequestBody AdminShipmentStatusUpdateDto dto) {
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(shipmentId, dto));
    }

    @PostMapping("/{shipmentId}/events")
    public ResponseEntity<ShipmentEventDto> addEvent(@PathVariable Long shipmentId,
            @RequestBody AdminShipmentEventCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shipmentService.addShipmentEvent(shipmentId, dto));
    }

    @GetMapping("/low-stock")
    public List<LowStockProductDto> getLowStockProducts() {
        return shipmentService.getLowStockProducts();
    }
}
