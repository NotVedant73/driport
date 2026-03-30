package com.driport.driport_backend.dto;

/**
 * DTO for creating a Razorpay Order
 * Razorpay requires amount in smallest currency unit (paise for INR)
 * Example: ₹100 = 10000 paise
 */
public class RazorpayOrderRequestDto {

    private Long amount;  // Amount in paise (100 rupees = 10000 paise)
    private String currency;  // INR, USD, etc.
    private String receipt;  // Internal reference ID (like order number)
    private String notes;  // Custom notes (optional)

    // Constructor
    public RazorpayOrderRequestDto(Long amount, String currency, String receipt) {
        this.amount = amount;
        this.currency = currency;
        this.receipt = receipt;
    }

    // Getters and Setters
    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getReceipt() {
        return receipt;
    }

    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}