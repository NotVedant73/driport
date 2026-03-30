package com.driport.driport_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Configuration for Google Gemini AI API integration
 *
 * Teaches Concepts:
 * - @Configuration: Marks this class as a source of bean definitions
 * - @Bean: Methods annotated with @Bean will be managed by Spring IoC container
 * - @Value: Injects property values from application.properties
 * - RestClient: Modern HTTP client in Spring (replacement for RestTemplate)
 */
@Configuration
public class GeminiConfig {

    // Inject API key from application.properties
    // ${} allows property placeholder resolution
    // The :default part is optional fallback value
    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    /**
     * Creates a RestClient bean configured for Gemini API
     *
     * Why RestClient over RestTemplate?
     * - Modern fluent API (easier to read)
     * - Better error handling
     * - Recommended by Spring Boot 3+
     *
     * Interview Tip: "RestClient is the modern replacement for RestTemplate,
     * offering a fluent API and better integration with Spring's error handling"
     */
    @Bean(name = "geminiRestClient")
    public RestClient geminiRestClient() {
        return RestClient.builder()
                .baseUrl(apiUrl) // Base URL for all requests
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    // Getters for other services to use
    public String getApiKey() {
        return apiKey;
    }

    public String getApiUrl() {
        return apiUrl;
    }
}
