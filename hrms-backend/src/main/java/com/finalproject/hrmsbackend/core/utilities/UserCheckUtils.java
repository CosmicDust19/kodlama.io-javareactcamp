package com.finalproject.hrmsbackend.core.utilities;

import lombok.experimental.UtilityClass;

import java.util.regex.Pattern;

@UtilityClass
public class UserCheckUtils {

    public boolean invalidEmail(String email) {
        return email == null || email.length() < 4 || email.length() > 100 || !Pattern.matches(Utils.Const.EMAIL_REGEXP, email);
    }

    public boolean invalidWebsite(String website) {
        return website == null || website.length() > 200 || !Pattern.matches(Utils.Const.WEBSITE_REGEXP, website);
    }

    public boolean invalidPhone(String phone) {
        return phone == null || phone.length() <= 9 || phone.length() >= 23 || !Pattern.matches(Utils.Const.PHONE_NUM_REGEXP, phone);
    }

    public boolean emailWebsiteDiffDomain(String email, String website) {
        if (email == null || website == null) return true;
        String emailDomain = email.substring(email.indexOf("@") + 1);
        return !website.contains(emailDomain);
    }

}
