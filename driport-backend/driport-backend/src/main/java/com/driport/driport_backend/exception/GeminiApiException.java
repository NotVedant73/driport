package com.driport.driport_backend.exception;

/**
 * Custom exception for Gemini AI API failures
 *
 * CONCEPT: Custom Exceptions
 * - Extend RuntimeException for unchecked exceptions
 * - Provides clear error context
 * - Can be caught by @ControllerAdvice for consistent error responses
 *
 * INTERVIEW TIP:
 * "I created custom exceptions for different failure scenarios
 * to provide clear error messages and enable proper error handling"
 */
public class GeminiApiException extends RuntimeException {

    public GeminiApiException(String message) {
        super(message);
    }

    public GeminiApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
