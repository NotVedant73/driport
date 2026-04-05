package com.driport.driport_backend.entiity;

import java.util.Set;

public enum ShipmentStatus {
    CREATED,
    PICKED_UP,
    IN_TRANSIT,
    OUT_FOR_DELIVERY,
    DELIVERED,
    FAILED_ATTEMPT;

    public static ShipmentStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Shipment status is required");
        }
        try {
            return ShipmentStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid shipment status: " + value);
        }
    }

    public boolean canTransitionTo(ShipmentStatus target) {
        if (target == null || this == target) {
            return false;
        }

        return switch (this) {
            case CREATED -> Set.of(PICKED_UP).contains(target);
            case PICKED_UP -> Set.of(IN_TRANSIT).contains(target);
            case IN_TRANSIT -> Set.of(OUT_FOR_DELIVERY).contains(target);
            case OUT_FOR_DELIVERY -> Set.of(DELIVERED, FAILED_ATTEMPT).contains(target);
            case FAILED_ATTEMPT -> Set.of(OUT_FOR_DELIVERY, DELIVERED).contains(target);
            case DELIVERED -> false;
        };
    }
}
