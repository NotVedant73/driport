package com.driport.driport_backend.dto;

import java.util.List;

/**
 * DTO for Google Gemini API Response
 *
 * Gemini API returns this structure:
 * {
 *   "candidates": [{
 *     "content": {
 *       "parts": [{"text": "AI generated text here"}],
 *       "role": "model"
 *     },
 *     "finishReason": "STOP"
 *   }]
 * }
 *
 * Teaching Points:
 * - We only map the fields we need (not the entire response)
 * - Jackson's @JsonIgnoreProperties handles extra fields automatically
 * - Nested structure mirrors API response
 */
public class GeminiResponseDto {

    private List<Candidate> candidates;

    public List<Candidate> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<Candidate> candidates) {
        this.candidates = candidates;
    }

    /**
     * Extracts the AI-generated text from the nested response structure
     */
    public String getGeneratedText() {
        if (candidates != null && !candidates.isEmpty()) {
            Candidate firstCandidate = candidates.get(0);
            if (firstCandidate.getContent() != null &&
                    firstCandidate.getContent().getParts() != null &&
                    !firstCandidate.getContent().getParts().isEmpty()) {
                return firstCandidate.getContent().getParts().get(0).getText();
            }
        }
        return "";
    }

    public static class Candidate {
        private Content content;
        private String finishReason;

        public Content getContent() {
            return content;
        }

        public void setContent(Content content) {
            this.content = content;
        }

        public String getFinishReason() {
            return finishReason;
        }

        public void setFinishReason(String finishReason) {
            this.finishReason = finishReason;
        }
    }

    public static class Content {
        private List<Part> parts;
        private String role;

        public List<Part> getParts() {
            return parts;
        }

        public void setParts(List<Part> parts) {
            this.parts = parts;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class Part {
        private String text;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}
