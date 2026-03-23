package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.AuthResponseDto;
import com.driport.driport_backend.dto.LoginRequestDto;
import com.driport.driport_backend.dto.RegisterRequestDto;

public interface IAuthService {
    AuthResponseDto login(LoginRequestDto dto);

    AuthResponseDto adminLogin(LoginRequestDto dto);

    AuthResponseDto register(RegisterRequestDto dto);
}
