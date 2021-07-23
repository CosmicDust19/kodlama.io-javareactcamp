package com.finalproject.hrmsbackend.core.business.concretes;

import com.finalproject.hrmsbackend.core.business.abstracts.UserCheckService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class UserCheckManager implements UserCheckService {

    @Override
    public boolean invalidEmail(String email) {
        return email == null || email.length() < 4 || email.length() > 100 || !Pattern.matches(Utils.Const.EMAIL_REGEXP, email);
    }

    @Override
    public boolean invalidWebsite(String website) {
        return website == null || website.length() > 200 || !Pattern.matches(Utils.Const.WEBSITE_REGEXP, website);
    }

    @Override
    public boolean invalidPhone(String phone) {
        return phone == null || phone.length() <= 9 || phone.length() >= 23 || !Pattern.matches(Utils.Const.PHONE_NUM_REGEXP, phone);
    }

    @Override
    public boolean emailWebsiteDiffDomain(String email, String website) {
        if (email == null || website == null) return true;
        String emailDomain = email.substring(email.indexOf("@") + 1);
        return !website.contains(emailDomain);
    }

}
