package com.finalproject.hrmsbackend.core.business.abstracts;

import org.springframework.stereotype.Component;

@Component
public interface EmailService {

    void sendVerificationMail(String email);

}
