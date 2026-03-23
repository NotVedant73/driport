package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.AuthResponseDto;
import com.driport.driport_backend.dto.LoginRequestDto;
import com.driport.driport_backend.dto.RegisterRequestDto;
import com.driport.driport_backend.entiity.User;
import com.driport.driport_backend.exception.BadRequestException;
import com.driport.driport_backend.exception.ForbiddenException;
import com.driport.driport_backend.exception.UnauthorizedException;
import com.driport.driport_backend.repository.UserRepository;
import com.driport.driport_backend.security.JwtUtil;
import com.driport.driport_backend.service.IAuthService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid Credentials"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        AuthResponseDto dto1 = new AuthResponseDto();
        dto1.setEmail(user.getEmail());
        dto1.setRole(user.getRole());
        dto1.setMessage("Login Successful");

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        dto1.setToken(token);

        return dto1;
    }

    @Override
    public AuthResponseDto adminLogin(LoginRequestDto dto) {
        // First validate credentials
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid Credentials"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        // Check if user has admin role - this is the key difference
        if (!"ROLE_ADMIN".equals(user.getRole())) {
            throw new ForbiddenException("Access denied. Admin privileges required.");
        }

        // Generate response
        AuthResponseDto response = new AuthResponseDto();
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setMessage("Admin Login Successful");

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        response.setToken(token);

        return response;
    }

    public AuthResponseDto register(RegisterRequestDto dto) {

        // check if user already present
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // Hash password
        user.setRole("ROLE_USER"); // Default role for customers

        // save to db
        User savedUser = userRepository.save(user);

        // 4. Generate JWT token (auto-login after registration)
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());

        // Build response
        AuthResponseDto response = new AuthResponseDto();
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());
        response.setMessage("Registration successful");
        response.setToken(token);

        return response;
    }
}
