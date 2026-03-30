package com.driport.driport_backend.dto;

import java.util.List;
import java.util.Map;

/**
 * DTO for Google Gemini API Request
 *
 * Gemini API expects this structure:
 * {
 *   "contents": [{
 *     "parts": [{"text": "your prompt here"}]
 *   }],
 *   "generationConfig": {
 *     "temperature": 0.7,
 *     "maxOutputTokens": 1000
 *   }
 * }
 *
 * Teaching Points:
 * - DTOs mirror external API structure
 * - Nested classes for complex JSON structures
 * - Jackson (Spring's JSON library) automatically serializes this to JSON
 */
public class GeminiRequestDto {

    private List<Content> contents;
    private GenerationConfig generationConfig;

    public GeminiRequestDto() {
    }

    public GeminiRequestDto(String promptText) {
        // Create the nested structure Gemini expects
        this.contents = List.of(
                new Content(List.of(new Part(promptText)))
        );
        this.generationConfig = new GenerationConfig(0.7, 1000);
    }

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }

    public GenerationConfig getGenerationConfig() {
        return generationConfig;
    }

    public void setGenerationConfig(GenerationConfig generationConfig) {
        this.generationConfig = generationConfig;
    }

    // Nested classes for JSON structure
    public static class Content {
        private List<Part> parts;

        public Content() {
        }

        public Content(List<Part> parts) {
            this.parts = parts;
        }

        public List<Part> getParts() {
            return parts;
        }

        public void setParts(List<Part> parts) {
            this.parts = parts;
        }
    }

    public static class Part {
        private String text;

        public Part() {
        }

        public Part(String text) {
            this.text = text;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }

    public static class GenerationConfig {
        private double temperature;  // Controls randomness (0.0 - 1.0)
        private int maxOutputTokens; // Max length of response

        public GenerationConfig() {
        }

        public GenerationConfig(double temperature, int maxOutputTokens) {
            this.temperature = temperature;
            this.maxOutputTokens = maxOutputTokens;
        }

        public double getTemperature() {
            return temperature;
        }

        public void setTemperature(double temperature) {
            this.temperature = temperature;
        }

        public int getMaxOutputTokens() {
            return maxOutputTokens;
        }

        public void setMaxOutputTokens(int maxOutputTokens) {
            this.maxOutputTokens = maxOutputTokens;
        }
    }
}
