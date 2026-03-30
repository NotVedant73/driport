package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AiOutfitResponseDto;
import com.driport.driport_backend.service.AiOutfitService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for AI-Powered Outfit Recommendations
 *
 * BACKEND CONCEPTS DEMONSTRATED:
 * 1. @RestController - Combines @Controller + @ResponseBody (automatic JSON serialization)
 * 2. @RequestMapping - Base path for all endpoints in this controller
 * 3. @GetMapping - Maps HTTP GET requests to methods
 * 4. @RequestParam - Extracts query parameters from URLs
 * 5. @PathVariable - Extracts path variables from URLs
 * 6. ResponseEntity - Gives control over HTTP status codes and headers
 * 7. Constructor Injection - Spring injects service dependency
 *
 * INTERVIEW TALKING POINTS:
 * - "I designed RESTful APIs following REST principles"
 * - "Used Spring's annotation-based configuration for clean, readable code"
 * - "Implemented proper error handling with appropriate HTTP status codes"
 *
 * API ENDPOINTS:
 * - GET /api/v1/ai/outfit?fitType=oversized&vibe=casual
 * - GET /api/v1/ai/complete-fit/123
 */
@RestController
@RequestMapping("api/v1/ai")
public class AiRecommendationController {

    private static final Logger logger = LoggerFactory.getLogger(AiRecommendationController.class);

    private final AiOutfitService aiOutfitService;

    /**
     * Constructor Injection
     * Spring automatically finds and injects AiOutfitService bean
     */
    public AiRecommendationController(AiOutfitService aiOutfitService) {
        this.aiOutfitService = aiOutfitService;
    }

    /**
     * Generate AI-powered outfit recommendation
     *
     * Example: GET /api/v1/ai/outfit?fitType=oversized&vibe=streetwear
     *
     * Query Parameters:
     * - fitType (optional): "oversized", "slim-fit", "regular"
     * - vibe (optional): "casual", "formal", "streetwear", "sporty"
     * - occasion (legacy, optional): kept for backward compatibility
     *
     * Returns: Complete outfit with product details
     *
     * CONCEPT: @RequestParam
     * - required = false: Parameter is optional
     * - defaultValue: Used if parameter not provided
     * - Spring automatically converts query params to method parameters
     *
     * @param fitType User's preferred fit style
     * @param legacyOccasion Legacy parameter (backward compatibility)
     * @param vibe User's style vibe preference
     * @return AI-generated outfit recommendation
     */
    @GetMapping("/outfit")
    public ResponseEntity<AiOutfitResponseDto> getOutfit(
            @RequestParam(value = "fitType", required = false) String fitType,
            @RequestParam(value = "occasion", required = false) String legacyOccasion,
            @RequestParam(value = "vibe", defaultValue = "casual") String vibe) {

        logger.info("GET /api/v1/ai/outfit - fitType: {}, vibe: {}", fitType, vibe);

        // Handle legacy "occasion" parameter (support old frontend versions)
        String effectiveFit = (fitType != null && !fitType.isBlank())
                ? fitType
                : (legacyOccasion != null ? legacyOccasion : "");

        try {
            AiOutfitResponseDto response = aiOutfitService.generateOutfits(effectiveFit, vibe);

            // Return 200 OK with outfit data
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to generate outfit", e);
            // Return 500 Internal Server Error
            // (Global exception handler will format this properly)
            throw e;
        }
    }

    /**
     * Complete outfit based on a selected product
     *
     * Example: GET /api/v1/ai/complete-fit/123
     * (Where 123 is the product ID)
     *
     * Use Case: User likes a black hoodie → AI suggests matching jeans and jacket
     *
     * Path Variable vs Query Param:
     * - Use @PathVariable for resource identifiers (e.g., /products/{id})
     * - Use @RequestParam for filters/options (e.g., /products?category=shirts)
     *
     * Previous: /complete-fit?productId=123 (query param)
     * Now: /complete-fit/123 (path variable) ← More RESTful!
     *
     * @param productId The product to build an outfit around
     * @return Complete outfit including the selected product
     */
    @GetMapping("/complete-fit/{productId}")
    public ResponseEntity<AiOutfitResponseDto> completeFit(
            @PathVariable("productId") Long productId) {

        logger.info("GET /api/v1/ai/complete-fit/{} - Generating complete outfit", productId);

        try {
            AiOutfitResponseDto response = aiOutfitService.generateCompleteFit(productId);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.warn("Product not found: {}", productId);
            // Return 404 Not Found
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            logger.error("Failed to generate complete fit for product {}", productId, e);
            throw e;
        }
    }

    /**
     * Backward compatibility endpoint (old query param style)
     * This ensures old frontend code still works
     *
     * Redirects to new RESTful endpoint internally
     */
    @GetMapping("/complete-fit")
    public ResponseEntity<AiOutfitResponseDto> completeFitLegacy(
            @RequestParam("productId") Long productId) {

        logger.info("GET /api/v1/ai/complete-fit?productId={} (legacy) - Redirecting to new endpoint", productId);
        return completeFit(productId);
    }
}
