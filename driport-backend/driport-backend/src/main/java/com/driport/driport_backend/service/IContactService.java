package com.driport.driport_backend.service;

import com.driport.driport_backend.dto.ContactRequestDto;

public interface IContactService {
    boolean saveContact (ContactRequestDto contactRequestDto);
}
