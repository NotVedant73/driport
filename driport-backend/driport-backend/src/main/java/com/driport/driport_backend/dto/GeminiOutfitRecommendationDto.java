package com.driport.driport_backend.dto;

/**
 * DTO for AI-generated outfit recommendation
 *
 * This represents the structured outfit data that Gemini AI will return
 * after we parse its JSON response.
 *
 * Example AI response:
 * {
 *   "top": {"id": 1, "reason": "Perfect streetwear vibe"},
 *   "outerwear": {"id": 9, "reason": "Complements the casual look"},
 *   "bottom": {"id": 24, "reason": "Distressed jeans match the aesthetic"}
 * }
 *
 * Teaching Points:
 * - Clean, focused DTOs for business logic
 * - Separate parsing DTO from domain DTO
 * - Null-safe accessors are good practice
 */
public class GeminiOutfitRecommendationDto {

    private ProductRecommendation top;
    private ProductRecommendation outerwear;
    private ProductRecommendation bottom;
    private String explanation;  // Overall outfit explanation from AI

    public ProductRecommendation getTop() {
        return top;
    }

    public void setTop(ProductRecommendation top) {
        this.top = top;
    }

    public ProductRecommendation getOuterwear() {
        return outerwear;
    }

    public void setOuterwear(ProductRecommendation outerwear) {
        this.outerwear = outerwear;
    }

    public ProductRecommendation getBottom() {
        return bottom;
    }

    public void setBottom(ProductRecommendation bottom) {
        this.bottom = bottom;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    /**
     * Nested class for individual product recommendation
     */
    public static class ProductRecommendation {
        private Long id;           // Product ID from our database
        private String reason;     // Why AI chose this product

        public ProductRecommendation() {
        }

        public ProductRecommendation(Long id, String reason) {
            this.id = id;
            this.reason = reason;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}
