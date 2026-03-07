package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.OrderCreateRequestDto;
import com.driport.driport_backend.dto.OrderItemDto;
import com.driport.driport_backend.dto.OrderSummaryDto;
import com.driport.driport_backend.entiity.Order;
import com.driport.driport_backend.entiity.OrderItem;
import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.repository.OrderRepository;
import com.driport.driport_backend.repository.ProductRepository;
import com.driport.driport_backend.service.IOrderService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    public OrderSummaryDto createOrder(OrderCreateRequestDto orderCreateRequestDto) {
        Order order = new Order();
        order.setCreatedAt(Instant.now());
        order.setStatus("PENDING");
        order.setCustomerName(orderCreateRequestDto.getCustomerName());
        order.setCustomerEmail(orderCreateRequestDto.getCustomerEmail());
        order.setCustomerPhone(orderCreateRequestDto.getCustomerPhone());
        order.setShippingAddress(orderCreateRequestDto.getShippingAddress());
        order.setNotes(orderCreateRequestDto.getNotes());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemDto itemDto : orderCreateRequestDto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + itemDto.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setQuantity(itemDto.getQuantity());

            BigDecimal lineTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            orderItem.setLineTotal(lineTotal);

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(lineTotal);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        OrderSummaryDto summaryDto = new OrderSummaryDto();
        summaryDto.setId(savedOrder.getId());
        summaryDto.setCreatedAt(savedOrder.getCreatedAt());
        summaryDto.setStatus(savedOrder.getStatus());
        summaryDto.setTotalAmount(savedOrder.getTotalAmount());

        return summaryDto;
    }

}

