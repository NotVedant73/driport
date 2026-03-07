package com.driport.driport_backend.controller;

import com.driport.driport_backend.dto.ContactRequestDto;
import com.driport.driport_backend.service.IContactService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/contacts")
public class ContactController {

    private final IContactService iContactService;

    public ContactController(IContactService iContactService){
        this.iContactService = iContactService;
    }

    @PostMapping
    public String saveContact(@RequestBody ContactRequestDto contactRequestDto){
        boolean isSaved = iContactService.saveContact(contactRequestDto);
        if(isSaved){
            return "Request processed successfully";
        }else {
            return "An error occurred. Please try again or contact Dev team";
        }
    }

}
