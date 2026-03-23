package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.AdminProductUpsertDto;
import com.driport.driport_backend.entiity.Product;

import java.util.List;

public interface IAdminProductService {
    List<Product> getAllProducts();

    Product createProduct(AdminProductUpsertDto dto);

    Product updateProduct(Long id, AdminProductUpsertDto dto);

    void deleteProduct(Long id);
}
