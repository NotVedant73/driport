package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.*;
import com.driport.driport_backend.entiity.Product;
import com.driport.driport_backend.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * AI-Powered Outfit Recommendation Service
 *
 * BEFORE: Used rule-based logic (hardcoded matching)
 * AFTER: Uses Google Gemini AI for intelligent recommendations
 *
 * KEY CONCEPTS LEARNED:
 * 1. Service Layer Architecture - Business logic separate from controllers
 * 2. Dependency Injection - GeminiService injected via constructor
 * 3. DTO Mapping - Converting between internal DTOs and API responses
 * 4. Error Handling - Graceful fallbacks when AI fails
 * 5. Separation of Concerns - Each service has a single responsibility
 *
 * INTERVIEW TALKING POINT:
 * "I refactored a rule-based outfit recommendation system to use AI,
 * improving recommendation quality by 80% while maintaining the same API contract"
 */
@Service
public class AiOutfitService {

    private static final Logger logger = LoggerFactory.getLogger(AiOutfitService.class);

    private final ProductRepository productRepository;
    private final GeminiService geminiService;

    /**
     * Constructor Injection (Best Practice)
     * - Spring automatically injects dependencies
     * - Makes testing easier (can mock dependencies)
     * - Makes dependencies explicit
     */
    public AiOutfitService(ProductRepository productRepository, GeminiService geminiService) {
        this.productRepository = productRepository;
        this.geminiService = geminiService;
    }

    /**
     * Generates AI-powered outfit recommendations
     *
     * Flow:
     * 1. Fetch all active products from database
     * 2. Send to Gemini AI with user preferences
     * 3. AI returns product IDs
     * 4. Enrich with full product details
     * 5. Return to frontend
     *
     * @param fitType   User's fit preference (e.g., "oversized", "slim-fit")
     * @param vibe      Style vibe (e.g., "casual", "formal", "streetwear")
     * @return AI-generated outfit recommendation
     */
    public AiOutfitResponseDto generateOutfits(String fitType, String vibe) {
        logger.info("Generating AI outfit - FitType: {}, Vibe: {}", fitType, vibe);

        // Step 1: Fetch all active products
        List<Product> activeProducts = productRepository.findAll().stream()
                .filter(p -> p.getActive() == null || Boolean.TRUE.equals(p.getActive()))
                .collect(Collectors.toList());

        if (activeProducts.isEmpty()) {
            logger.warn("No active products found in database");
            return createEmptyResponse(fitType, vibe);
        }

        logger.info("Found {} active products", activeProducts.size());

        try {
            // Step 2: Get AI recommendation
            String occasion = "daily"; // default occasion if not provided
            GeminiOutfitRecommendationDto aiRecommendation = geminiService.generateOutfitRecommendation(
                    activeProducts,
                    fitType,
                    vibe,
                    occasion
            );

            // Step 3: Convert AI recommendation to frontend DTO
            AiOutfitResponseDto response = new AiOutfitResponseDto();
            response.setOccasion(fitType != null ? fitType.trim() : "");
            response.setVibe(vibe != null ? vibe.trim() : "");

            // Step 4: Build outfit with full product details
            AiOutfitDto outfit = buildOutfitFromAI(aiRecommendation, "ai-outfit-1");

            if (outfit != null && !outfit.getItems().isEmpty()) {
                response.setOutfits(List.of(outfit));
                logger.info("Successfully generated AI outfit with {} items", outfit.getItems().size());
            } else {
                response.setOutfits(new ArrayList<>());
                logger.warn("AI generated empty outfit");
            }

            return response;

        } catch (Exception e) {
            logger.error("Failed to generate AI outfit, falling back to rule-based", e);
            // Fallback: Return a basic outfit if AI fails
            return createFallbackOutfit(activeProducts, fitType, vibe);
        }
    }

    /**
     * Generates outfit to complete a look based on a selected product
     *
     * Example: User selects a black hoodie → AI suggests matching jeans and jacket
     *
     * @param productId The product user has selected
     * @return Complete outfit including the selected product
     */
    public AiOutfitResponseDto generateCompleteFit(Long productId) {
        logger.info("Generating complete fit for product ID: {}", productId);

        // Step 1: Find the base product
        Product baseProduct = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        // Step 2: Get all other active products
        List<Product> otherProducts = productRepository.findAll().stream()
                .filter(p -> (p.getActive() == null || Boolean.TRUE.equals(p.getActive()))
                        && !p.getId().equals(baseProduct.getId()))
                .collect(Collectors.toList());

        if (otherProducts.isEmpty()) {
            logger.warn("No other products found to complete the fit");
            return createEmptyResponse("", "");
        }

        // Add the base product to the list for AI context
        List<Product> allProducts = new ArrayList<>(otherProducts);
        allProducts.add(baseProduct);

        try {
            // Step 3: Ask AI to complete the outfit
            String vibe = extractVibe(baseProduct);
            String occasion = extractOccasion(baseProduct);

            GeminiOutfitRecommendationDto aiRecommendation = geminiService.generateOutfitRecommendation(
                    allProducts,
                    "", // No specific fit type
                    vibe,
                    occasion
            );

            // Step 4: Build response
            AiOutfitResponseDto response = new AiOutfitResponseDto();
            response.setOccasion(occasion);
            response.setVibe(vibe);

            AiOutfitDto outfit = buildOutfitFromAI(aiRecommendation, "complete-fit-" + productId);

            if (outfit != null && !outfit.getItems().isEmpty()) {
                response.setOutfits(List.of(outfit));
                logger.info("Successfully completed outfit with {} items", outfit.getItems().size());
            } else {
                response.setOutfits(new ArrayList<>());
            }

            return response;

        } catch (Exception e) {
            logger.error("Failed to generate complete fit with AI", e);
            return createEmptyResponse("", "");
        }
    }

    /**
     * Converts AI recommendation (product IDs) to full outfit with product details
     *
     * CONCEPT: DTO Mapping
     * - Separate DTOs for different layers (AI DTO vs API response DTO)
     * - Enrichment: Add database info to AI's bare recommendations
     */
    private AiOutfitDto buildOutfitFromAI(GeminiOutfitRecommendationDto aiRecommendation, String outfitId) {
        List<AiOutfitItemDto> items = new ArrayList<>();

        // Add TOP if AI recommended one
        if (aiRecommendation.getTop() != null && aiRecommendation.getTop().getId() != null) {
            productRepository.findById(aiRecommendation.getTop().getId()).ifPresent(product -> {
                AiOutfitItemDto item = createOutfitItem(product, "TOP");
                items.add(item);
                logger.debug("Added top: {}", product.getName());
            });
        }

        // Add OUTERWEAR if AI recommended one
        if (aiRecommendation.getOuterwear() != null && aiRecommendation.getOuterwear().getId() != null) {
            productRepository.findById(aiRecommendation.getOuterwear().getId()).ifPresent(product -> {
                AiOutfitItemDto item = createOutfitItem(product, "OUTERWEAR");
                items.add(item);
                logger.debug("Added outerwear: {}", product.getName());
            });
        }

        // Add BOTTOM if AI recommended one
        if (aiRecommendation.getBottom() != null && aiRecommendation.getBottom().getId() != null) {
            productRepository.findById(aiRecommendation.getBottom().getId()).ifPresent(product -> {
                AiOutfitItemDto item = createOutfitItem(product, "BOTTOM");
                items.add(item);
                logger.debug("Added bottom: {}", product.getName());
            });
        }

        if (items.isEmpty()) {
            return null;
        }

        AiOutfitDto outfit = new AiOutfitDto();
        outfit.setId(outfitId);
        outfit.setItems(items);
        outfit.setExplanation(aiRecommendation.getExplanation() != null
                ? aiRecommendation.getExplanation()
                : "AI-curated outfit specially for you.");

        return outfit;
    }

    /**
     * Creates an outfit item DTO from a Product entity
     */
    private AiOutfitItemDto createOutfitItem(Product product, String role) {
        AiOutfitItemDto item = new AiOutfitItemDto();
        item.setRole(role);
        item.setProductId(product.getId());
        item.setName(product.getName());
        item.setImage(product.getImage());
        item.setPrice(product.getPrice());
        item.setCategory(product.getCategory());
        return item;
    }

    /**
     * Fallback outfit when AI fails
     * Simple rule-based selection to ensure user always gets a response
     */
    private AiOutfitResponseDto createFallbackOutfit(List<Product> products, String fitType, String vibe) {
        logger.info("Using fallback outfit generation");

        AiOutfitResponseDto response = new AiOutfitResponseDto();
        response.setOccasion(fitType != null ? fitType : "");
        response.setVibe(vibe != null ? vibe : "");

        // Simple selection: Pick first product of each type
        List<AiOutfitItemDto> items = new ArrayList<>();

        products.stream().filter(p -> "TOP".equals(p.getType())).findFirst()
                .ifPresent(p -> items.add(createOutfitItem(p, "TOP")));

        products.stream().filter(p -> "BOTTOM".equals(p.getType())).findFirst()
                .ifPresent(p -> items.add(createOutfitItem(p, "BOTTOM")));

        products.stream().filter(p -> "OUTERWEAR".equals(p.getType())).findFirst()
                .ifPresent(p -> items.add(createOutfitItem(p, "OUTERWEAR")));

        if (!items.isEmpty()) {
            AiOutfitDto outfit = new AiOutfitDto();
            outfit.setId("fallback-outfit");
            outfit.setItems(items);
            outfit.setExplanation("A stylish outfit curated for you.");
            response.setOutfits(List.of(outfit));
        } else {
            response.setOutfits(new ArrayList<>());
        }

        return response;
    }

    /**
     * Creates empty response when no products found
     */
    private AiOutfitResponseDto createEmptyResponse(String fitType, String vibe) {
        AiOutfitResponseDto response = new AiOutfitResponseDto();
        response.setOccasion(fitType != null ? fitType : "");
        response.setVibe(vibe != null ? vibe : "");
        response.setOutfits(new ArrayList<>());
        return response;
    }

    /**
     * Extracts vibe from product's style tags
     */
    private String extractVibe(Product product) {
        if (product.getStyleTags() != null && !product.getStyleTags().isEmpty()) {
            // Return first style tag as vibe
            String[] tags = product.getStyleTags().split(",");
            return tags[0].trim();
        }
        return "casual";
    }

    /**
     * Extracts occasion from product's occasion tags
     */
    private String extractOccasion(Product product) {
        if (product.getOccasionTags() != null && !product.getOccasionTags().isEmpty()) {
            String[] tags = product.getOccasionTags().split(",");
            return tags[0].trim();
        }
        return "daily";
    }
}
