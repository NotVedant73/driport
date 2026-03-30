package com.driport.driport_backend.dto;

import java.math.BigDecimal;

/**
 * DTO sent to frontend containing Razorpay order details
 * Frontend uses this to open Razorpay checkout modal
 */
public class RazorpayOrderResponseDto {

    private String razorpayOrderId;  // Razorpay's order ID (starts with order_)
    private Long orderId;  // Our internal order ID
    private BigDecimal amount;  // Amount in rupees (frontend display)
    private String currency;
    private String key;  // Razorpay Key ID (pk_test_xxx) - needed for checkout

    // Constructor
    public RazorpayOrderResponseDto(String razorpayOrderId, Long orderId, BigDecimal amount, String currency, String key) {
        this.razorpayOrderId = razorpayOrderId;
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.key = key;
    }

    // Getters and Setters
    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}