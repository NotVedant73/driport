package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.AdminProductUpsertDto;
import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.exception.ResourceNotFoundException;
import com.driport.driport_backend.repository.ProductRepository;
import com.driport.driport_backend.service.IAdminProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminProductServiceImpl implements IAdminProductService {

    private final ProductRepository productRepository;

    public AdminProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product createProduct(AdminProductUpsertDto dto) {
        Product product = new Product();
        applyDto(product, dto);
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, AdminProductUpsertDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        applyDto(product, dto);
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", id);
        }
        productRepository.deleteById(id);
    }

    private void applyDto(Product product, AdminProductUpsertDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }
        if (dto.getPrice() == null) {
            throw new IllegalArgumentException("Product price is required");
        }
        if (dto.getCategory() == null || dto.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Product category is required");
        }
        if (dto.getRating() == null) {
            throw new IllegalArgumentException("Product rating is required");
        }

        product.setName(dto.getName().trim());
        product.setPrice(dto.getPrice());
        product.setImage(dto.getImage());
        product.setCategory(dto.getCategory().trim());
        product.setRating(dto.getRating());
        product.setDescription(dto.getDescription());
        product.setActive(dto.getActive() != null ? dto.getActive() : Boolean.TRUE);
        product.setType(dto.getType() != null ? dto.getType().trim() : null);
        product.setStyleTags(dto.getStyleTags() != null ? dto.getStyleTags().trim() : null);
        product.setOccasionTags(dto.getOccasionTags() != null ? dto.getOccasionTags().trim() : null);
    }
}
