package com.driport.driport_backend.repository;

import com.driport.driport_backend.entiity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}

