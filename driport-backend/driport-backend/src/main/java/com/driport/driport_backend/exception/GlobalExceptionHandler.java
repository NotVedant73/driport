package com.driport.driport_backend.exception;

import com.driport.driport_backend.dto.ErrorResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

        // 404 Not Found
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponseDto> handleResourceNotFound(
                        ResourceNotFoundException ex,
                        HttpServletRequest request) {
                ErrorResponseDto error = new ErrorResponseDto(
                                HttpStatus.NOT_FOUND.value(),
                                ex.getMessage(),
                                request.getRequestURI());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // 400 Bad Request
        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ErrorResponseDto> handleBadRequest(
                        BadRequestException ex,
                        HttpServletRequest request) {
                ErrorResponseDto error = new ErrorResponseDto(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                request.getRequestURI());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // 401 Unauthorized
        @ExceptionHandler(UnauthorizedException.class)
        public ResponseEntity<ErrorResponseDto> handleUnauthorized(
                        UnauthorizedException ex,
                        HttpServletRequest request) {
                ErrorResponseDto error = new ErrorResponseDto(
                                HttpStatus.UNAUTHORIZED.value(),
                                ex.getMessage(),
                                request.getRequestURI());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // 403 Forbidden
        @ExceptionHandler(ForbiddenException.class)
        public ResponseEntity<ErrorResponseDto> handleForbidden(
                        ForbiddenException ex,
                        HttpServletRequest request) {
                ErrorResponseDto error = new ErrorResponseDto(
                                HttpStatus.FORBIDDEN.value(),
                                ex.getMessage(),
                                request.getRequestURI());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        // 400 Validation Errors (field-level)
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>> handleValidationErrors(
                        MethodArgumentNotValidException ex) {
                Map<String, String> errors = new HashMap<>();
                ex.getBindingResult().getFieldErrors().forEach(error -> {
                        errors.put(error.getField(), error.getDefaultMessage());
                });
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        // 400 Generic IllegalArgumentException (keep for backward compatibility)
        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ErrorResponseDto> handleIllegalArgument(
                        IllegalArgumentException ex,
                        HttpServletRequest request) {
                ErrorResponseDto error = new ErrorResponseDto(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage() != null ? ex.getMessage() : "Bad request",
                                request.getRequestURI());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // 500 Internal Server Error (catch-all)
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponseDto> handleGenericException(
                        Exception ex,
                        HttpServletRequest request) {
                ErrorResponseDto error = new ErrorResponseDto(
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "An unexpected error occurred: " + ex.getMessage(),
                                request.getRequestURI());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
}