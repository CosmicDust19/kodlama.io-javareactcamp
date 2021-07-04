package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.EmployerCheckService;
import org.springframework.stereotype.Service;

@Service
public class EmployerCheckManager implements EmployerCheckService {

    @Override
    public boolean isCompatibleEmailAndWebSite(String email, String website) {
        String emailDomain = email.substring(email.indexOf("@") + 1);
        return website.contains(emailDomain);
    }

}
