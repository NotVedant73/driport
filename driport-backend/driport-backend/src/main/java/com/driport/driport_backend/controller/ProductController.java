package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.ProductSearchResponseDto;
import com.driport.driport_backend.service.IProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.driport.driport_backend.entiity.Product;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("api/v1/products")

public class ProductController {

    private final IProductService iProductService;

    public ProductController(IProductService iProductService) {
        this.iProductService = iProductService;
    }

    @GetMapping
    public List<Product> getProducts() {
        List<Product> productList = iProductService.getProducts();
        return productList;
    }

    @GetMapping("/search")
    public ResponseEntity<ProductSearchResponseDto> searchProducts(
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(name = "categories", required = false) String categories,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(name = "sort", defaultValue = "ratingDesc") String sort,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {

        List<String> categoryList = categories == null || categories.isBlank()
                ? List.of()
                : Arrays.stream(categories.split(","))
                        .map(String::trim)
                        .filter(value -> !value.isBlank())
                        .toList();

        ProductSearchResponseDto response = iProductService.searchProducts(
                query,
                categoryList,
                minPrice,
                maxPrice,
                sort,
                page,
                size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable("id") Long id) {
        Product product = iProductService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

}
