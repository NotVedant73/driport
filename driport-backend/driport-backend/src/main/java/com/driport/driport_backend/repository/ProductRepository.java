package com.driport.driport_backend.repository;

import com.driport.driport_backend.entiity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

	@Modifying
	@Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity - :quantity WHERE p.id = :productId AND p.stockQuantity >= :quantity")
	int decrementStockIfEnough(Long productId, Integer quantity);

	@Modifying
	@Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity + :quantity WHERE p.id = :productId")
	int incrementStock(Long productId, Integer quantity);

	@Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.lowStockThreshold ORDER BY p.stockQuantity ASC")
	List<Product> findLowStockProducts();

	List<Product> findByStockQuantityLessThanEqualOrderByStockQuantityAsc(Integer threshold);

}
