package com.hrms.hw.core.concretes;

import com.hrms.hw.core.abstracts.EmailService;
import org.springframework.stereotype.Component;

@Component
public class EmailManager implements EmailService {

    @Override
    public void sendVerificationMail(String email) {
        //sent..
    }

}
