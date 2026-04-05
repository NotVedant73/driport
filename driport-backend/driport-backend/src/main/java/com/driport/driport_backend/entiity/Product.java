package com.driport.driport_backend.entiity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "PRODUCTS")
public class Product {

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false)
    private Long id;

    @Column(name = "NAME", nullable = false, length = 250)
    private String name;

    @Column(name = "PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "IMAGE", length = 500)
    private String image;

    @Column(name = "CATEGORY", nullable = false, length = 250)
    private String category;

    @Column(name = "RATING", nullable = false)
    private Integer rating;

    @Column(name = "DESCRIPTION", length = 3000)
    private String description;

    @Column(name = "ACTIVE")
    private Boolean active;

    @Column(name = "STOCK_QUANTITY", nullable = false)
    private Integer stockQuantity = 1;

    @Column(name = "LOW_STOCK_THRESHOLD", nullable = false)
    private Integer lowStockThreshold = 1;

    @Column(name = "PRODUCT_TYPE", length = 50)
    private String type;

    @Column(name = "STYLE_TAGS", length = 500)
    private String styleTags;

    @Column(name = "OCCASION_TAGS", length = 500)
    private String occasionTags;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStyleTags() {
        return styleTags;
    }

    public void setStyleTags(String styleTags) {
        this.styleTags = styleTags;
    }

    public String getOccasionTags() {
        return occasionTags;
    }

    public void setOccasionTags(String occasionTags) {
        this.occasionTags = occasionTags;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

}
