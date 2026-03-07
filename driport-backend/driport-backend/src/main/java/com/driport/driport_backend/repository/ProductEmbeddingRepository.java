package com.driport.driport_backend.repository;

import com.driport.driport_backend.entiity.ProductEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductEmbeddingRepository extends JpaRepository<ProductEmbedding, Long> {
    Optional<ProductEmbedding> findByProduct_Id(Long productId);
}
