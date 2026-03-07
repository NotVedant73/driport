package com.driport.driport_backend.repository;

import com.driport.driport_backend.entiity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
