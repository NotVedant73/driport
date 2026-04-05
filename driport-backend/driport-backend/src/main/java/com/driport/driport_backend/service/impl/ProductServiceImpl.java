package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.ProductSearchResponseDto;
import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.repository.ProductRepository;
import com.driport.driport_backend.service.IProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    @Override
    public ProductSearchResponseDto searchProducts(String query,
            List<String> categories,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            int page,
            int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        Pageable pageable = PageRequest.of(safePage, safeSize, resolveSort(sort));
        Specification<Product> specification = buildSpecification(query, categories, minPrice, maxPrice);

        Page<Product> result = productRepository.findAll(specification, pageable);

        ProductSearchResponseDto response = new ProductSearchResponseDto();
        response.setContent(result.getContent());
        response.setPage(result.getNumber());
        response.setSize(result.getSize());
        response.setTotalPages(result.getTotalPages());
        response.setTotalElements(result.getTotalElements());
        response.setHasNext(result.hasNext());
        response.setHasPrevious(result.hasPrevious());
        return response;
    }

    private Specification<Product> buildSpecification(String query,
            List<String> categories,
            BigDecimal minPrice,
            BigDecimal maxPrice) {
        return (root, cq, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            predicates.add(cb.or(cb.isTrue(root.get("active")), cb.isNull(root.get("active"))));

            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("name")), pattern),
                                cb.like(cb.lower(root.get("category")), pattern)));
            }

            if (categories != null && !categories.isEmpty()) {
                List<String> normalized = categories.stream()
                        .filter(value -> value != null && !value.isBlank())
                        .map(value -> value.trim().toLowerCase(Locale.ROOT))
                        .toList();
                if (!normalized.isEmpty()) {
                    predicates.add(cb.lower(root.get("category")).in(normalized));
                }
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private Sort resolveSort(String sort) {
        if (sort == null) {
            return Sort.by(Sort.Direction.DESC, "rating").and(Sort.by(Sort.Direction.DESC, "id"));
        }

        return switch (sort) {
            case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
            case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
            case "newest" -> Sort.by(Sort.Direction.DESC, "id");
            case "ratingAsc" -> Sort.by(Sort.Direction.ASC, "rating");
            case "ratingDesc" -> Sort.by(Sort.Direction.DESC, "rating").and(Sort.by(Sort.Direction.DESC, "id"));
            default -> Sort.by(Sort.Direction.DESC, "rating").and(Sort.by(Sort.Direction.DESC, "id"));
        };
    }
}
