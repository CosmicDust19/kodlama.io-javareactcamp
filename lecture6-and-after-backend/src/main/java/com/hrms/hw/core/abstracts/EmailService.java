package com.hrms.hw.core.abstracts;

import org.springframework.stereotype.Component;

@Component
public interface EmailService {

    void sendVerificationMail(String email);

}
