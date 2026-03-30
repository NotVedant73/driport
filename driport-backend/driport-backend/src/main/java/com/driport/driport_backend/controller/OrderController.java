package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.OrderCreateRequestDto;
import com.driport.driport_backend.dto.OrderSummaryDto;
import com.driport.driport_backend.dto.RazorpayOrderResponseDto;
import com.driport.driport_backend.entiity.Order;
import com.driport.driport_backend.repository.OrderRepository;
import com.driport.driport_backend.service.IOrderService;
import com.driport.driport_backend.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/v1/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final IOrderService iOrderService;
    private final PaymentService paymentService;
    private final OrderRepository orderRepository;

    public OrderController(IOrderService iOrderService,
            PaymentService paymentService,
            OrderRepository orderRepository) {
        this.iOrderService = iOrderService;
        this.paymentService = paymentService;
        this.orderRepository = orderRepository;
    }

    /**
     * Create order and initiate Razorpay payment
     *
     * Flow:
     * 1. Create order in database (status: PENDING)
     * 2. Create Razorpay order via API
     * 3. Return both order details and Razorpay payment details to frontend
     *
     * POST /api/v1/orders
     * Body: { customerName, customerEmail, customerPhone, shippingAddress, items[]
     * }
     *
     * Response: {
     * "order": { id, createdAt, status, totalAmount },
     * "payment": { razorpayOrderId, orderId, amount, currency, key }
     * }
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestBody OrderCreateRequestDto orderCreateRequestDto) {

        try {
            // Step 1: Create order in database
            OrderSummaryDto orderSummary = iOrderService.createOrder(orderCreateRequestDto);
            logger.info("Order created: {}", orderSummary.getId());

            // Step 2: Fetch full order entity (needed for payment creation)
            Order order = orderRepository.findById(orderSummary.getId())
                    .orElseThrow(() -> new RuntimeException("Order not found after creation"));

            // Step 3: Create Razorpay order
            RazorpayOrderResponseDto paymentDetails = paymentService.createRazorpayOrder(order);
            logger.info("Razorpay order created: {}", paymentDetails.getRazorpayOrderId());

            // Step 4: Return combined response
            Map<String, Object> response = new HashMap<>();
            response.put("order", orderSummary);
            response.put("payment", paymentDetails);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            logger.error("Error creating order with payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create order: " + e.getMessage()));
        }
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

}
