package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.PaymentVerificationDto;
import com.driport.driport_backend.dto.RazorpayOrderResponseDto;
import com.driport.driport_backend.entiity.Order;
import com.driport.driport_backend.entiity.Payment;
import com.driport.driport_backend.repository.OrderRepository;
import com.driport.driport_backend.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Service layer for handling Razorpay payment operations
 * Includes: Create order, verify signature, update payment status
 */
@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.currency}")
    private String currency;

    public PaymentService(RazorpayClient razorpayClient,
                          PaymentRepository paymentRepository,
                          OrderRepository orderRepository) {
        this.razorpayClient = razorpayClient;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Step 1: Create Razorpay order
     * Called when user clicks "Place Order"
     *
     * @param order Our database order
     * @return RazorpayOrderResponseDto with order details for frontend
     * @throws Exception if Razorpay API call fails
     */
    @Transactional
    public RazorpayOrderResponseDto createRazorpayOrder(Order order) throws Exception {
        try {
            // Convert rupees to paise (smallest currency unit)
            // Example: ₹100.50 → 10050 paise
            long amountInPaise = order.getTotalAmount()
                    .multiply(new BigDecimal("100"))
                    .longValue();

            // Create request JSON for Razorpay API
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "ORDER-" + order.getId());

            // Optional: Add notes for reference
            JSONObject notes = new JSONObject();
            notes.put("order_id", order.getId());
            notes.put("customer_name", order.getCustomerName());
            orderRequest.put("notes", notes);

            // Call Razorpay API to create order
            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            logger.info("Razorpay order created: {} for Order ID: {}", razorpayOrderId, order.getId());

            // Save Payment record in our database (status: CREATED)
            Payment payment = new Payment(
                    order,
                    razorpayOrderId,
                    order.getTotalAmount(),
                    currency,
                    "CREATED"
            );
            paymentRepository.save(payment);

            // Return response for frontend
            return new RazorpayOrderResponseDto(
                    razorpayOrderId,
                    order.getId(),
                    order.getTotalAmount(),
                    currency,
                    razorpayKeyId  // Frontend needs Key ID for Razorpay checkout
            );

        } catch (Exception e) {
            logger.error("Failed to create Razorpay order for Order ID: {}", order.getId(), e);
            throw new Exception("Failed to create payment order: " + e.getMessage());
        }
    }

    /**
     * Step 2: Verify payment signature
     * Called after user completes payment in Razorpay checkout
     *
     * SECURITY CRITICAL: Prevents fake payment confirmations
     *
     * @param verificationDto Contains order ID, payment ID, and signature from frontend
     * @return true if signature is valid, false otherwise
     */
    @Transactional
    public boolean verifyPaymentSignature(PaymentVerificationDto verificationDto) {
        try {
            // Find payment record by Razorpay Order ID
            Payment payment = paymentRepository
                    .findByRazorpayOrderId(verificationDto.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Payment not found for order: "
                            + verificationDto.getRazorpayOrderId()));

            // Create attribute map for signature verification
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", verificationDto.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", verificationDto.getRazorpayPaymentId());
            attributes.put("razorpay_signature", verificationDto.getRazorpaySignature());

            // Verify signature using Razorpay SDK
            // This uses HMAC-SHA256: signature = hmac(order_id + "|" + payment_id, secret)
            boolean isValid = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);

            if (isValid) {
                // Signature valid → Update payment status
                payment.setRazorpayPaymentId(verificationDto.getRazorpayPaymentId());
                payment.setRazorpaySignature(verificationDto.getRazorpaySignature());
                payment.setStatus("SUCCESS");
                payment.setUpdatedAt(Instant.now());
                paymentRepository.save(payment);

                // Update order status to PAID
                Order order = payment.getOrder();
                order.setStatus("PAID");
                orderRepository.save(order);

                logger.info("Payment verified successfully: {} for Order ID: {}",
                        verificationDto.getRazorpayPaymentId(), order.getId());

                return true;
            } else {
                // Signature invalid → Log and mark as failed
                logger.error("Payment signature verification failed for payment: {}",
                        verificationDto.getRazorpayPaymentId());

                payment.setStatus("FAILED");
                payment.setFailureReason("Invalid signature");
                payment.setUpdatedAt(Instant.now());
                paymentRepository.save(payment);

                return false;
            }

        } catch (Exception e) {
            logger.error("Error verifying payment signature", e);
            return false;
        }
    }

    /**
     * Step 3: Handle payment failure
     * Called if payment fails or user cancels
     *
     * @param razorpayOrderId Razorpay order ID
     * @param reason Failure reason
     */
    @Transactional
    public void handlePaymentFailure(String razorpayOrderId, String reason) {
        try {
            Payment payment = paymentRepository
                    .findByRazorpayOrderId(razorpayOrderId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            payment.setStatus("FAILED");
            payment.setFailureReason(reason);
            payment.setUpdatedAt(Instant.now());
            paymentRepository.save(payment);

            // Update order status
            Order order = payment.getOrder();
            order.setStatus("PAYMENT_FAILED");
            orderRepository.save(order);

            logger.info("Payment failed for Order ID: {} - Reason: {}", order.getId(), reason);

        } catch (Exception e) {
            logger.error("Error handling payment failure", e);
        }
    }

    /**
     * Webhook handler (Optional - for async confirmation)
     * Razorpay calls this endpoint when payment status changes
     *
     * Note: Webhook signature verification is DIFFERENT from payment signature
     *
     * @param webhookBody Raw webhook body from Razorpay
     * @param webhookSignature Signature from X-Razorpay-Signature header
     * @return true if webhook processed successfully
     */
    @Transactional
    public boolean handleWebhook(String webhookBody, String webhookSignature) {
        try {
            // Verify webhook signature
            boolean isValid = Utils.verifyWebhookSignature(webhookBody, webhookSignature, razorpayKeySecret);

            if (!isValid) {
                logger.error("Invalid webhook signature");
                return false;
            }

            // Parse webhook event
            JSONObject webhook = new JSONObject(webhookBody);
            String event = webhook.getString("event");

            // Handle payment.captured event
            if ("payment.captured".equals(event)) {
                JSONObject payload = webhook.getJSONObject("payload");
                JSONObject paymentEntity = payload.getJSONObject("payment").getJSONObject("entity");

                String razorpayPaymentId = paymentEntity.getString("id");
                String razorpayOrderId = paymentEntity.getString("order_id");

                // Update payment if not already updated
                Payment payment = paymentRepository
                        .findByRazorpayOrderId(razorpayOrderId)
                        .orElse(null);

                if (payment != null && !"SUCCESS".equals(payment.getStatus())) {
                    payment.setRazorpayPaymentId(razorpayPaymentId);
                    payment.setStatus("SUCCESS");
                    payment.setUpdatedAt(Instant.now());
                    paymentRepository.save(payment);

                    Order order = payment.getOrder();
                    order.setStatus("PAID");
                    orderRepository.save(order);

                    logger.info("Webhook: Payment captured for Order ID: {}", order.getId());
                }
            }

            return true;

        } catch (Exception e) {
            logger.error("Error processing webhook", e);
            return false;
        }
    }
}