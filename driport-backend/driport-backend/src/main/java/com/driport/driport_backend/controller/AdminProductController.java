package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AdminProductUpsertDto;
import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.service.IAdminProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/admin/products")
public class AdminProductController {

    private final IAdminProductService adminProductService;

    public AdminProductController(IAdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @GetMapping
    public List<Product> getProducts() {
        return adminProductService.getAllProducts();
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody AdminProductUpsertDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminProductService.createProduct(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody AdminProductUpsertDto dto) {
        return ResponseEntity.ok(adminProductService.updateProduct(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
