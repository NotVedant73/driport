package com.driport.driport_backend.dto;

/**
 * DTO received from frontend after user completes payment
 * Contains payment details that need signature verification
 */
public class PaymentVerificationDto {

    private String razorpayOrderId;  // Order ID we created
    private String razorpayPaymentId;  // Payment ID from Razorpay (after user pays)
    private String razorpaySignature;  // HMAC signature to verify authenticity

    // Constructors
    public PaymentVerificationDto() {
    }

    public PaymentVerificationDto(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
    }

    // Getters and Setters
    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }
}