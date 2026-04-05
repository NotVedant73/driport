package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.AdminCreateShipmentDto;
import com.driport.driport_backend.dto.AdminShipmentEventCreateDto;
import com.driport.driport_backend.dto.AdminShipmentStatusUpdateDto;
import com.driport.driport_backend.dto.CustomerOrderDto;
import com.driport.driport_backend.dto.LowStockProductDto;
import com.driport.driport_backend.dto.ShipmentDto;
import com.driport.driport_backend.dto.ShipmentEventDto;
import com.driport.driport_backend.entiity.Order;
import com.driport.driport_backend.entiity.OrderItem;
import com.driport.driport_backend.entiity.OrderStatus;
import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.entiity.Shipment;
import com.driport.driport_backend.entiity.ShipmentEvent;
import com.driport.driport_backend.entiity.ShipmentStatus;
import com.driport.driport_backend.exception.ForbiddenException;
import com.driport.driport_backend.exception.ResourceNotFoundException;
import com.driport.driport_backend.repository.OrderRepository;
import com.driport.driport_backend.repository.ProductRepository;
import com.driport.driport_backend.repository.ShipmentEventRepository;
import com.driport.driport_backend.repository.ShipmentRepository;
import com.driport.driport_backend.service.EmailNotificationService;
import com.driport.driport_backend.service.IShipmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShipmentServiceImpl implements IShipmentService {

    private static final String MANUAL_PROVIDER = "MANUAL";

    private final ShipmentRepository shipmentRepository;
    private final ShipmentEventRepository shipmentEventRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final EmailNotificationService emailNotificationService;

    public ShipmentServiceImpl(ShipmentRepository shipmentRepository,
            ShipmentEventRepository shipmentEventRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository,
            EmailNotificationService emailNotificationService) {
        this.shipmentRepository = shipmentRepository;
        this.shipmentEventRepository = shipmentEventRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.emailNotificationService = emailNotificationService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShipmentDto> getAllShipments() {
        return shipmentRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toShipmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public ShipmentDto createShipment(AdminCreateShipmentDto dto) {
        if (dto.getOrderId() == null) {
            throw new IllegalArgumentException("Order ID is required");
        }
        if (dto.getCourierName() == null || dto.getCourierName().isBlank()) {
            throw new IllegalArgumentException("Courier name is required");
        }
        if (dto.getTrackingNumber() == null || dto.getTrackingNumber().isBlank()) {
            throw new IllegalArgumentException("Tracking number is required");
        }

        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", dto.getOrderId()));

        if (shipmentRepository.existsByOrderId(order.getId())) {
            throw new IllegalArgumentException("Shipment already exists for this order");
        }

        OrderStatus currentStatus = OrderStatus.fromValue(order.getStatus());
        if (currentStatus != OrderStatus.PAID && currentStatus != OrderStatus.PROCESSING
                && currentStatus != OrderStatus.PACKED) {
            throw new IllegalArgumentException("Shipment can be created only for PAID/PROCESSING/PACKED orders");
        }

        Shipment shipment = new Shipment();
        shipment.setOrder(order);
        shipment.setProvider(MANUAL_PROVIDER);
        shipment.setCourierName(dto.getCourierName().trim());
        shipment.setTrackingNumber(dto.getTrackingNumber().trim());
        shipment.setStatus(ShipmentStatus.CREATED.name());
        shipment.setEstimatedDeliveryDate(dto.getEstimatedDeliveryDate());
        shipment.setCreatedAt(Instant.now());
        shipment.setUpdatedAt(Instant.now());

        Shipment saved = shipmentRepository.save(shipment);
        saveShipmentEvent(saved, ShipmentStatus.CREATED.name(), "Warehouse", "Shipment created");

        if (currentStatus == OrderStatus.PAID) {
            order.setStatus(OrderStatus.PROCESSING.name());
            orderRepository.save(order);
        }

        return toShipmentDto(saved);
    }

    @Override
    public ShipmentDto updateShipmentStatus(Long shipmentId, AdminShipmentStatusUpdateDto dto) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment", shipmentId));

        ShipmentStatus currentStatus = ShipmentStatus.fromValue(shipment.getStatus());
        ShipmentStatus targetStatus = ShipmentStatus.fromValue(dto.getStatus());

        if (!currentStatus.canTransitionTo(targetStatus)) {
            throw new IllegalArgumentException(
                    "Invalid shipment status transition from " + currentStatus + " to " + targetStatus);
        }

        shipment.setStatus(targetStatus.name());
        shipment.setUpdatedAt(Instant.now());

        if (targetStatus == ShipmentStatus.IN_TRANSIT && shipment.getShippedAt() == null) {
            shipment.setShippedAt(Instant.now());
        }
        if (targetStatus == ShipmentStatus.DELIVERED) {
            shipment.setDeliveredAt(Instant.now());
        }

        Shipment saved = shipmentRepository.save(shipment);
        saveShipmentEvent(saved, targetStatus.name(), dto.getLocation(), dto.getNote());

        syncOrderStatusFromShipment(saved.getOrder(), targetStatus);
        if (shouldNotifyCustomer(targetStatus)) {
            emailNotificationService.sendShipmentStatusUpdate(saved.getOrder(), saved, targetStatus, dto.getLocation());
        }

        return toShipmentDto(saved);
    }

    @Override
    public ShipmentEventDto addShipmentEvent(Long shipmentId, AdminShipmentEventCreateDto dto) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment", shipmentId));

        String eventStatus = dto.getStatus();
        if (eventStatus == null || eventStatus.isBlank()) {
            eventStatus = shipment.getStatus();
        }

        ShipmentEvent event = saveShipmentEvent(shipment, eventStatus, dto.getLocation(), dto.getNote());
        return toEventDto(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LowStockProductDto> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(this::toLowStockDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerOrderDto> getMyOrders(String customerEmail) {
        return orderRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail).stream()
                .map(this::toCustomerOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ShipmentDto getTracking(Long orderId, String customerEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (!order.getCustomerEmail().equalsIgnoreCase(customerEmail)) {
            throw new ForbiddenException("You cannot access tracking for this order");
        }

        Shipment shipment = shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment", orderId));

        return toShipmentDto(shipment);
    }

    @Override
    public void cancelOrder(Long orderId, String customerEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (!order.getCustomerEmail().equalsIgnoreCase(customerEmail)) {
            throw new ForbiddenException("You cannot cancel this order");
        }

        OrderStatus currentStatus = OrderStatus.fromValue(order.getStatus());
        if (currentStatus == OrderStatus.SHIPPED
                || currentStatus == OrderStatus.OUT_FOR_DELIVERY
                || currentStatus == OrderStatus.DELIVERED
                || currentStatus == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Order cannot be cancelled at this stage");
        }

        for (OrderItem item : order.getItems()) {
            productRepository.incrementStock(item.getProduct().getId(), item.getQuantity());
        }

        order.setStatus(OrderStatus.CANCELLED.name());
        orderRepository.save(order);
    }

    private void syncOrderStatusFromShipment(Order order, ShipmentStatus shipmentStatus) {
        OrderStatus currentOrderStatus = OrderStatus.fromValue(order.getStatus());
        OrderStatus targetOrderStatus = null;

        if (shipmentStatus == ShipmentStatus.PICKED_UP) {
            targetOrderStatus = OrderStatus.PACKED;
        } else if (shipmentStatus == ShipmentStatus.IN_TRANSIT) {
            targetOrderStatus = OrderStatus.SHIPPED;
        } else if (shipmentStatus == ShipmentStatus.OUT_FOR_DELIVERY) {
            targetOrderStatus = OrderStatus.OUT_FOR_DELIVERY;
        } else if (shipmentStatus == ShipmentStatus.DELIVERED) {
            targetOrderStatus = OrderStatus.DELIVERED;
        }

        if (targetOrderStatus != null && currentOrderStatus.canTransitionTo(targetOrderStatus)) {
            order.setStatus(targetOrderStatus.name());
            orderRepository.save(order);
        }
    }

    private ShipmentEvent saveShipmentEvent(Shipment shipment, String status, String location, String note) {
        ShipmentEvent event = new ShipmentEvent();
        event.setShipment(shipment);
        event.setStatus(status);
        event.setLocation((location == null || location.isBlank()) ? "N/A" : location.trim());
        event.setNote((note == null || note.isBlank()) ? "Status updated" : note.trim());
        event.setEventTime(Instant.now());
        return shipmentEventRepository.save(event);
    }

    private ShipmentDto toShipmentDto(Shipment shipment) {
        ShipmentDto dto = new ShipmentDto();
        dto.setShipmentId(shipment.getId());
        dto.setOrderId(shipment.getOrder().getId());
        dto.setOrderStatus(shipment.getOrder().getStatus());
        dto.setProvider(shipment.getProvider());
        dto.setCourierName(shipment.getCourierName());
        dto.setTrackingNumber(shipment.getTrackingNumber());
        dto.setShipmentStatus(shipment.getStatus());
        dto.setEstimatedDeliveryDate(shipment.getEstimatedDeliveryDate());
        dto.setShippedAt(shipment.getShippedAt());
        dto.setDeliveredAt(shipment.getDeliveredAt());
        dto.setEvents(shipmentEventRepository.findByShipmentIdOrderByEventTimeAsc(shipment.getId()).stream()
                .map(this::toEventDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private ShipmentEventDto toEventDto(ShipmentEvent event) {
        ShipmentEventDto dto = new ShipmentEventDto();
        dto.setStatus(event.getStatus());
        dto.setLocation(event.getLocation());
        dto.setNote(event.getNote());
        dto.setEventTime(event.getEventTime());
        return dto;
    }

    private LowStockProductDto toLowStockDto(Product product) {
        LowStockProductDto dto = new LowStockProductDto();
        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setLowStockThreshold(product.getLowStockThreshold());
        return dto;
    }

    private CustomerOrderDto toCustomerOrderDto(Order order) {
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
    }

    private boolean shouldNotifyCustomer(ShipmentStatus shipmentStatus) {
        return shipmentStatus == ShipmentStatus.IN_TRANSIT
                || shipmentStatus == ShipmentStatus.OUT_FOR_DELIVERY
                || shipmentStatus == ShipmentStatus.DELIVERED;
    }
}
