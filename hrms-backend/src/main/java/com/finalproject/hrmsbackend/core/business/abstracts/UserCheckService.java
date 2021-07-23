package com.finalproject.hrmsbackend.core.business.abstracts;

public interface UserCheckService {

    boolean invalidEmail(String email);

    boolean invalidWebsite(String website);

    boolean invalidPhone(String phone);

    boolean emailWebsiteDiffDomain(String email, String website);
}
