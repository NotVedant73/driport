package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.AuthResponseDto;
import com.driport.driport_backend.dto.LoginRequestDto;
import com.driport.driport_backend.dto.RegisterRequestDto;
import com.driport.driport_backend.service.IAuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {

    private final IAuthService iAuthService;

    public AuthController(IAuthService iAuthService) {
        this.iAuthService = iAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto dto) {
        AuthResponseDto response = iAuthService.login(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponseDto> adminLogin(@Valid @RequestBody LoginRequestDto dto) {
        AuthResponseDto response = iAuthService.adminLogin(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto dto) {
        AuthResponseDto result = iAuthService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
