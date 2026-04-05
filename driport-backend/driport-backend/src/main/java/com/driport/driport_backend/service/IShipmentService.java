package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.AdminCreateShipmentDto;
import com.driport.driport_backend.dto.AdminShipmentEventCreateDto;
import com.driport.driport_backend.dto.AdminShipmentStatusUpdateDto;
import com.driport.driport_backend.dto.CustomerOrderDto;
import com.driport.driport_backend.dto.LowStockProductDto;
import com.driport.driport_backend.dto.ShipmentDto;
import com.driport.driport_backend.dto.ShipmentEventDto;

import java.util.List;

public interface IShipmentService {

    List<ShipmentDto> getAllShipments();

    ShipmentDto createShipment(AdminCreateShipmentDto dto);

    ShipmentDto updateShipmentStatus(Long shipmentId, AdminShipmentStatusUpdateDto dto);

    ShipmentEventDto addShipmentEvent(Long shipmentId, AdminShipmentEventCreateDto dto);

    List<LowStockProductDto> getLowStockProducts();

    List<CustomerOrderDto> getMyOrders(String customerEmail);

    ShipmentDto getTracking(Long orderId, String customerEmail);

    void cancelOrder(Long orderId, String customerEmail);
}
