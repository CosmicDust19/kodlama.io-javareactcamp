package com.finalproject.hrmsbackend.core.abstracts;

import org.springframework.stereotype.Component;

@Component
public interface EmailService {

    void sendVerificationMail(String email);

}
