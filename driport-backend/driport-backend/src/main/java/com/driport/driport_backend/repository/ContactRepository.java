package com.driport.driport_backend.repository;

import com.driport.driport_backend.entiity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {

}
