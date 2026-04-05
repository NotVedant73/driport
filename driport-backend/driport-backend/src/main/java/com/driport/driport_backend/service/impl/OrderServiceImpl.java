package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.OrderCreateRequestDto;
import com.driport.driport_backend.dto.CustomerOrderDto;
import com.driport.driport_backend.dto.OrderItemDto;
import com.driport.driport_backend.dto.OrderSummaryDto;
import com.driport.driport_backend.entiity.Order;
import com.driport.driport_backend.entiity.OrderItem;
import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.repository.ShipmentRepository;
import com.driport.driport_backend.repository.OrderRepository;
import com.driport.driport_backend.repository.ProductRepository;
import com.driport.driport_backend.service.IOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ShipmentRepository shipmentRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
            ProductRepository productRepository,
            ShipmentRepository shipmentRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.shipmentRepository = shipmentRepository;
    }

    @Override
    @Transactional
    public OrderSummaryDto createOrder(OrderCreateRequestDto dto) {

        // first build order as orderitem depends on order
        Order order = buildOrder(dto);

        for (OrderItemDto itemDto : dto.getItems()) {
            OrderItem item = buildOrderItem(order, itemDto); // 2. build each item
            order.getItems().add(item);
            order.setTotalAmount(order.getTotalAmount().add(item.getLineTotal()));
        }

        Order saved = orderRepository.save(order); // 3. save to DB
        return toSummaryDto(saved);

    }

    private Order buildOrder(OrderCreateRequestDto dto) {

        Order order = new Order();
        order.setCreatedAt(Instant.now());
        order.setStatus("PENDING");
        order.setTotalAmount(BigDecimal.ZERO);
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(dto.getCustomerEmail());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setShippingAddress(dto.getShippingAddress());
        order.setNotes(dto.getNotes());
        return order;
    }

    private OrderItem buildOrderItem(Order order, OrderItemDto itemDto) {

        Product product = productRepository.findById(itemDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.getProductId()));

        int rowsUpdated = productRepository.decrementStockIfEnough(product.getId(), itemDto.getQuantity());
        if (rowsUpdated == 0) {
            throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
        }

        BigDecimal lineTotal = product.getPrice()
                .multiply(BigDecimal.valueOf(itemDto.getQuantity()));

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setProductName(product.getName());
        item.setUnitPrice(product.getPrice());
        item.setQuantity(itemDto.getQuantity());
        item.setLineTotal(lineTotal);
        return item;
    }

    private OrderSummaryDto toSummaryDto(Order order) {
        OrderSummaryDto dto = new OrderSummaryDto();
        dto.setId(order.getId());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerOrderDto> getMyOrders(String customerEmail) {
        return orderRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail)
                .stream()
                .map(order -> {
                    CustomerOrderDto dto = new CustomerOrderDto();
                    dto.setId(order.getId());
                    dto.setCreatedAt(order.getCreatedAt());
                    dto.setStatus(order.getStatus());
                    dto.setTotalAmount(order.getTotalAmount());
                    shipmentRepository.findByOrderId(order.getId()).ifPresent(shipment -> {
                        dto.setShipmentStatus(shipment.getStatus());
                        dto.setCourierName(shipment.getCourierName());
                        dto.setTrackingNumber(shipment.getTrackingNumber());
                    });
                    return dto;
                })
                .collect(Collectors.toList());
    }

}
