package com.driport.driport_backend.service.impl;


import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.repository.ProductRepository;
import com.driport.driport_backend.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestAttribute;
import com.driport.driport_backend.entiity.Product;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    public List<Product> getProducts(){

        return productRepository.findAll()
                .stream().collect(Collectors.toList());

    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }








}
