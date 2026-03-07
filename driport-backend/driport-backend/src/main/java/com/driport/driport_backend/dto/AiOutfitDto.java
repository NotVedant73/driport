package com.driport.driport_backend.dto;

import java.util.List;

public class AiOutfitDto {
    private String id;
    private List<AiOutfitItemDto> items;
    private String explanation;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<AiOutfitItemDto> getItems() {
        return items;
    }

    public void setItems(List<AiOutfitItemDto> items) {
        this.items = items;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
