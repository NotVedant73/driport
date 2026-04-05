package com.driport.driport_backend.service;

import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.dto.ProductSearchResponseDto;

import java.math.BigDecimal;
import java.util.List;

public interface IProductService {

    List<Product> getProducts();

    Product getProductById(Long id);

    ProductSearchResponseDto searchProducts(String query,
            List<String> categories,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            int page,
            int size);

}
