package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AdminCategoryUpsertDto;
import com.driport.driport_backend.entiity.Category;
import com.driport.driport_backend.service.IAdminCategoryService;
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
@RequestMapping("api/v1/admin/categories")
public class AdminCategoryController {

    private final IAdminCategoryService adminCategoryService;

    public AdminCategoryController(IAdminCategoryService adminCategoryService) {
        this.adminCategoryService = adminCategoryService;
    }

    @GetMapping
    public List<Category> getCategories() {
        return adminCategoryService.getAllCategories();
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody AdminCategoryUpsertDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminCategoryService.createCategory(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody AdminCategoryUpsertDto dto) {
        return ResponseEntity.ok(adminCategoryService.updateCategory(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        adminCategoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
