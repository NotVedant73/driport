package com.driport.driport_backend.repository;

import com.driport.driport_backend.entiity.ShipmentEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShipmentEventRepository extends JpaRepository<ShipmentEvent, Long> {

    List<ShipmentEvent> findByShipmentIdOrderByEventTimeAsc(Long shipmentId);
}
