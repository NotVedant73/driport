package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.AdminCategoryUpsertDto;
import com.driport.driport_backend.entiity.Category;

import java.util.List;

public interface IAdminCategoryService {
    List<Category> getAllCategories();

    Category createCategory(AdminCategoryUpsertDto dto);

    Category updateCategory(Long id, AdminCategoryUpsertDto dto);

    void deleteCategory(Long id);
}
