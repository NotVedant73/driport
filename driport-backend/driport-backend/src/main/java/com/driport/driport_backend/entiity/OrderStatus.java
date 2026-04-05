package com.driport.driport_backend.entiity;

import java.util.Set;

public enum OrderStatus {
    PENDING,
    PAID,
    PROCESSING,
    PACKED,
    SHIPPED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED,
    PAYMENT_FAILED;

    public static OrderStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Order status is required");
        }
        try {
            return OrderStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid order status: " + value);
        }
    }

    public boolean canTransitionTo(OrderStatus target) {
        if (target == null || this == target) {
            return false;
        }

        return switch (this) {
            case PENDING -> Set.of(PAID, PAYMENT_FAILED, CANCELLED).contains(target);
            case PAID -> Set.of(PROCESSING, CANCELLED, PAYMENT_FAILED).contains(target);
            case PROCESSING -> Set.of(PACKED, CANCELLED).contains(target);
            case PACKED -> Set.of(SHIPPED, CANCELLED).contains(target);
            case SHIPPED -> Set.of(OUT_FOR_DELIVERY).contains(target);
            case OUT_FOR_DELIVERY -> Set.of(DELIVERED).contains(target);
            case DELIVERED, CANCELLED, PAYMENT_FAILED -> false;
        };
    }
}
