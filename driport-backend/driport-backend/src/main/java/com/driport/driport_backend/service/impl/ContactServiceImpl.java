package com.driport.driport_backend.service.impl;

import com.driport.driport_backend.dto.ContactRequestDto;
import com.driport.driport_backend.entiity.Contact;
import com.driport.driport_backend.repository.ContactRepository;
import com.driport.driport_backend.service.EmailNotificationService;
import com.driport.driport_backend.service.IContactService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ContactServiceImpl implements IContactService {

    private final ContactRepository contactRepository;
    private final EmailNotificationService emailNotificationService;

    public ContactServiceImpl(ContactRepository contactRepository, EmailNotificationService emailNotificationService){
        this.contactRepository = contactRepository;
        this.emailNotificationService = emailNotificationService;
    }

    @Override
    public boolean saveContact(ContactRequestDto contactRequestDto){
        try{
            Contact contact = transformToEntity(contactRequestDto);
            contact.setCreatedAt(Instant.now());
            contactRepository.save(contact);
            emailNotificationService.sendContactAutoReply(contactRequestDto);
            return true;
        } catch (Exception exception) {
            return false;
        }
    }

    private Contact transformToEntity(ContactRequestDto contactRequestDto){
        Contact contact = new Contact();
        BeanUtils.copyProperties(contactRequestDto, contact);
        return contact;
    }
}
