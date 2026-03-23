package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.AdminCategoryUpsertDto;
import com.driport.driport_backend.entiity.Category;
import com.driport.driport_backend.exception.ResourceNotFoundException;
import com.driport.driport_backend.repository.CategoryRepository;
import com.driport.driport_backend.service.IAdminCategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminCategoryServiceImpl implements IAdminCategoryService {

    private final CategoryRepository categoryRepository;

    public AdminCategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(AdminCategoryUpsertDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }

        categoryRepository.findByNameIgnoreCase(dto.getName().trim())
                .ifPresent(c -> {
                    throw new IllegalArgumentException("Category already exists: " + dto.getName().trim());
                });

        Category category = new Category();
        category.setName(dto.getName().trim());
        category.setActive(dto.getActive() != null ? dto.getActive() : Boolean.TRUE);

        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, AdminCategoryUpsertDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));

        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }

        // Check for duplicate name (excluding current category)
        categoryRepository.findByNameIgnoreCase(dto.getName().trim())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> {
                    throw new IllegalArgumentException("Category already exists: " + dto.getName().trim());
                });

        category.setName(dto.getName().trim());
        if (dto.getActive() != null) {
            category.setActive(dto.getActive());
        }

        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category", id);
        }
        categoryRepository.deleteById(id);
    }
}
