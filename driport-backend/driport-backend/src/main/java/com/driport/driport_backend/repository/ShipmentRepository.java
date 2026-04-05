package com.driport.driport_backend.repository;

import com.driport.driport_backend.entiity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Optional<Shipment> findByOrderId(Long orderId);

    boolean existsByOrderId(Long orderId);

    List<Shipment> findAllByOrderByCreatedAtDesc();
}
