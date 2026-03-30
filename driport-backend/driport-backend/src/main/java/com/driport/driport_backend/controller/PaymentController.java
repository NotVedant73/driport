package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.PaymentVerificationDto;
import com.driport.driport_backend.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for payment operations
 * Endpoints: verify payment, handle failures, process webhooks
 */
@RestController
@RequestMapping("api/v1/payments")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Endpoint: Verify payment signature after user completes payment
     * Called by frontend after Razorpay checkout success
     *
     * POST /api/v1/payments/verify
     * Body: { "razorpayOrderId", "razorpayPaymentId", "razorpaySignature" }
     *
     * @param verificationDto Payment verification details from frontend
     * @return Success/failure response
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @RequestBody PaymentVerificationDto verificationDto) {

        try {
            boolean isValid = paymentService.verifyPaymentSignature(verificationDto);

            if (isValid) {
                logger.info("Payment verified successfully: {}", verificationDto.getRazorpayPaymentId());
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Payment verified successfully"));
            } else {
                logger.warn("Payment verification failed: Invalid signature");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "success", false,
                        "message", "Payment verification failed: Invalid signature"));
            }

        } catch (Exception e) {
            logger.error("Error verifying payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Error verifying payment: " + e.getMessage()));
        }
    }

    /**
     * Endpoint: Handle payment failure
     * Called by frontend if payment fails or user cancels
     *
     * POST /api/v1/payments/failure
     * Body: { "razorpayOrderId", "reason" }
     *
     * @param payload Failure details
     * @return Acknowledgment response
     */
    @PostMapping("/failure")
    public ResponseEntity<Map<String, Object>> handlePaymentFailure(
            @RequestBody Map<String, String> payload) {

        try {
            String razorpayOrderId = payload.get("razorpayOrderId");
            String reason = payload.getOrDefault("reason", "Payment failed");

            paymentService.handlePaymentFailure(razorpayOrderId, reason);

            logger.info("Payment failure handled for order: {}", razorpayOrderId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment failure recorded"));

        } catch (Exception e) {
            logger.error("Error handling payment failure", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Error handling failure: " + e.getMessage()));
        }
    }

    /**
     * Endpoint: Razorpay webhook handler
     * Razorpay calls this endpoint when payment status changes
     *
     * POST /api/v1/payments/webhook/razorpay
     * Headers: X-Razorpay-Signature (webhook signature)
     * Body: Raw webhook JSON from Razorpay
     *
     * @param webhookBody Raw webhook payload
     * @param signature   Webhook signature from header
     * @return HTTP 200 (success) or 400 (failure)
     */
    @PostMapping("/webhook/razorpay")
    public ResponseEntity<Map<String, String>> handleWebhook(
            @RequestBody String webhookBody,
            @RequestHeader("X-Razorpay-Signature") String signature) {

        try {
            boolean success = paymentService.handleWebhook(webhookBody, signature);

            if (success) {
                logger.info("Webhook processed successfully");
                return ResponseEntity.ok(Map.of("status", "success"));
            } else {
                logger.warn("Webhook processing failed: Invalid signature");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("status", "failed", "reason", "Invalid signature"));
            }

        } catch (Exception e) {
            logger.error("Error processing webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "reason", e.getMessage()));
        }
    }
}
