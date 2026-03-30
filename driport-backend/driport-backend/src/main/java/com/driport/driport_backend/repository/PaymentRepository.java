package com.driport.driport_backend.repository;

import com.driport.driport_backend.entiity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Find payment by Razorpay order ID (unique)
     */
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    /**
     * Find payment by Razorpay payment ID
     */
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    /**
     * Find all payments for a specific order
     */
    List<Payment> findByOrderId(Long orderId);

    /**
     * Check if payment exists with given Razorpay order ID
     */
    boolean existsByRazorpayOrderId(String razorpayOrderId);
}