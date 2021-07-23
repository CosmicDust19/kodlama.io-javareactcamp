package com.finalproject.hrmsbackend.core.business.concretes;

import com.finalproject.hrmsbackend.core.business.abstracts.EmailService;
import org.springframework.stereotype.Component;

@Component
public class EmailManager implements EmailService {

    @Override
    public void sendVerificationMail(String email) {
        //sent..
    }

}
