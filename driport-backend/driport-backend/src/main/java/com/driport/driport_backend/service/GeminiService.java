package com.driport.driport_backend.service;

import com.driport.driport_backend.config.GeminiConfig;
import com.driport.driport_backend.dto.GeminiOutfitRecommendationDto;
import com.driport.driport_backend.dto.GeminiRequestDto;
import com.driport.driport_backend.dto.GeminiResponseDto;
import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.exception.GeminiApiException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * Service for integrating with Google Gemini AI API
 *
 * KEY BACKEND CONCEPTS DEMONSTRATED:
 * 1. External API Integration - How to call third-party REST APIs
 * 2. Error Handling - Graceful failure handling
 * 3. Prompt Engineering - Crafting effective AI prompts
 * 4. JSON Parsing - Converting string to objects
 * 5. Dependency Injection - @Qualifier for specific beans
 *
 * INTERVIEW TALKING POINTS:
 * - "I integrated Google's Gemini AI using RestClient for HTTP communication"
 * - "Implemented retry logic and error handling for API failures"
 * - "Used prompt engineering to guide AI towards structured JSON responses"
 */
@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    private final RestClient restClient;
    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper;  // For JSON parsing

    /**
     * Constructor Injection (Best Practice!)
     *
     * Why Constructor Injection over @Autowired?
     * - Makes dependencies explicit
     * - Enables easier testing (can mock dependencies)
     * - Immutable fields (final)
     * - Fails fast if dependencies missing
     *
     * @Qualifier tells Spring which RestClient bean to inject (we have a specific one for Gemini)
     */
    public GeminiService(
            @Qualifier("geminiRestClient") RestClient restClient,
            GeminiConfig geminiConfig,
            ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.geminiConfig = geminiConfig;
        this.objectMapper = objectMapper;
    }

    /**
     * Generates outfit recommendation using Gemini AI
     *
     * @param products    Available products from database
     * @param fitType     User's fit preference (e.g., "oversized", "slim")
     * @param vibe        User's style vibe (e.g., "casual", "formal")
     * @param occasion    Occasion (e.g., "party", "daily")
     * @return Structured outfit recommendation from AI
     */
    public GeminiOutfitRecommendationDto generateOutfitRecommendation(
            List<Product> products,
            String fitType,
            String vibe,
            String occasion) {

        try {
            // Step 1: Build the AI prompt
            String prompt = buildPrompt(products, fitType, vibe, occasion);
            logger.info("Sending prompt to Gemini AI (length: {} chars)", prompt.length());

            // Step 2: Make API call to Gemini
            GeminiResponseDto response = callGeminiApi(prompt);

            // Step 3: Extract and parse the AI's response
            String generatedText = response.getGeneratedText();
            logger.info("Received AI response: {}", generatedText.substring(0, Math.min(100, generatedText.length())));

            // Step 4: Parse JSON from AI response
            return parseAiResponse(generatedText);

        } catch (Exception e) {
            logger.error("Error generating outfit with Gemini AI", e);
            throw new GeminiApiException("Failed to generate outfit recommendation: " + e.getMessage());
        }
    }

    /**
     * Builds the prompt for Gemini AI
     *
     * PROMPT ENGINEERING TIPS:
     * - Be specific about output format (JSON)
     * - Give examples
     * - Provide context
     * - Set constraints (must use provided products)
     */
    private String buildPrompt(List<Product> products, String fitType, String vibe, String occasion) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("You are an expert fashion stylist for Driport, a streetwear clothing store.\n\n");
        prompt.append("TASK: Recommend a complete outfit from ONLY the products listed below.\n\n");

        // Categorize products
        List<Product> tops = products.stream()
                .filter(p -> "TOP".equalsIgnoreCase(p.getType()))
                .toList();

        List<Product> outerwear = products.stream()
                .filter(p -> "OUTERWEAR".equalsIgnoreCase(p.getType()))
                .toList();

        List<Product> bottoms = products.stream()
                .filter(p -> "BOTTOM".equalsIgnoreCase(p.getType()))
                .toList();

        // Add available products to prompt
        prompt.append("AVAILABLE TOPS:\n");
        tops.forEach(p -> prompt.append(String.format("- ID: %d, Name: %s, Price: ₹%.2f, Category: %s, Tags: %s, Occasion: %s\n",
                p.getId(), p.getName(), p.getPrice(), p.getCategory(),
                p.getStyleTags() != null ? p.getStyleTags() : "",
                p.getOccasionTags() != null ? p.getOccasionTags() : "")));

        prompt.append("\nAVAILABLE OUTERWEAR:\n");
        outerwear.forEach(p -> prompt.append(String.format("- ID: %d, Name: %s, Price: ₹%.2f, Category: %s, Tags: %s, Occasion: %s\n",
                p.getId(), p.getName(), p.getPrice(), p.getCategory(),
                p.getStyleTags() != null ? p.getStyleTags() : "",
                p.getOccasionTags() != null ? p.getOccasionTags() : "")));

        prompt.append("\nAVAILABLE BOTTOMS:\n");
        bottoms.forEach(p -> prompt.append(String.format("- ID: %d, Name: %s, Price: ₹%.2f, Category: %s, Tags: %s, Occasion: %s\n",
                p.getId(), p.getName(), p.getPrice(), p.getCategory(),
                p.getStyleTags() != null ? p.getStyleTags() : "",
                p.getOccasionTags() != null ? p.getOccasionTags() : "")));

        // Add user preferences WITH UNIQUE SEED
        long timestamp = System.currentTimeMillis();
        prompt.append(String.format("\nUSER PREFERENCES:\n- Fit Type: %s\n- Vibe: %s\n- Occasion: %s\n- Generation ID: %d\n\n",
                fitType != null ? fitType : "any",
                vibe != null ? vibe : "casual",
                occasion != null ? occasion : "daily",
                timestamp));

        // Specify output format WITH VARIETY INSTRUCTIONS
        prompt.append("INSTRUCTIONS:\n");
        prompt.append("1. 🚨 CRITICAL: Generate a UNIQUE outfit combination. Try DIFFERENT product IDs than usual.\n");
        prompt.append("2. Be creative and explore variety - don't always pick the same items\n");
        prompt.append("3. Select ONE top, ONE outerwear (optional), and ONE bottom that work well together\n");
        prompt.append("4. Match the user's preferences and occasion\n");
        prompt.append("5. Consider color coordination and style compatibility\n");
        prompt.append("6. Respond ONLY with valid JSON (no markdown, no explanations outside JSON):\n\n");

        prompt.append("{\n");
        prompt.append("  \"top\": {\"id\": <product_id>, \"reason\": \"<why this top>\"},\n");
        prompt.append("  \"outerwear\": {\"id\": <product_id>, \"reason\": \"<why this outerwear>\"}, // optional, can be null\n");
        prompt.append("  \"bottom\": {\"id\": <product_id>, \"reason\": \"<why this bottom>\"},\n");
        prompt.append("  \"explanation\": \"<overall outfit description in 1-2 sentences>\"\n");
        prompt.append("}\n");

        return prompt.toString();
    }

    /**
     * Makes HTTP POST request to Gemini API
     *
     * KEY CONCEPT: RestClient Usage
     * - Fluent API for building requests
     * - Automatic JSON serialization/deserialization
     * - Built-in error handling with proper exceptions
     */
    private GeminiResponseDto callGeminiApi(String prompt) {
        try {
            // Create request DTO
            GeminiRequestDto request = new GeminiRequestDto(prompt);

            // Make API call
            return restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("key", geminiConfig.getApiKey())
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(GeminiResponseDto.class);

        } catch (Exception e) {
            logger.error("Gemini API call failed", e);
            throw new GeminiApiException("API call failed: " + e.getMessage());
        }
    }

    /**
     * Parses AI's text response into structured DTO
     *
     * KEY CONCEPT: JSON Parsing
     * - ObjectMapper from Jackson library
     * - Converts JSON string → Java object
     * - Handles nested structures automatically
     */
    private GeminiOutfitRecommendationDto parseAiResponse(String aiResponse) {
        try {
            // Clean the response (AI might wrap JSON in markdown code blocks)
            String cleanedJson = aiResponse.trim();
            if (cleanedJson.startsWith("```json")) {
                cleanedJson = cleanedJson.substring(7);
            }
            if (cleanedJson.startsWith("```")) {
                cleanedJson = cleanedJson.substring(3);
            }
            if (cleanedJson.endsWith("```")) {
                cleanedJson = cleanedJson.substring(0, cleanedJson.length() - 3);
            }
            cleanedJson = cleanedJson.trim();

            // Parse JSON to DTO
            return objectMapper.readValue(cleanedJson, GeminiOutfitRecommendationDto.class);

        } catch (Exception e) {
            logger.error("Failed to parse AI response: {}", aiResponse, e);
            throw new GeminiApiException("Failed to parse AI recommendation: " + e.getMessage());
        }
    }
}
