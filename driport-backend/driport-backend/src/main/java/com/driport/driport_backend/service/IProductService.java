package com.driport.driport_backend.service;



import com.driport.driport_backend.entiity.Product;

import java.util.List;

public interface IProductService {

    List<Product> getProducts();

    Product getProductById(Long id);

}
