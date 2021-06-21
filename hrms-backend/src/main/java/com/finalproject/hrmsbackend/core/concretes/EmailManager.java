package com.finalproject.hrmsbackend.core.concretes;

import com.finalproject.hrmsbackend.core.abstracts.EmailService;
import org.springframework.stereotype.Component;

@Component
public class EmailManager implements EmailService {

    @Override
    public void sendVerificationMail(String email) {
        //sent..
    }

}
