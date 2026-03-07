package com.driport.driport_backend.dto;

import java.math.BigDecimal;

public class AdminProductUpsertDto {

    private String name;
    private BigDecimal price;
    private String image;
    private String category;
    private Integer rating;
    private String description;
    private Boolean active;
    private String type;
    private String styleTags;
    private String occasionTags;

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
}

