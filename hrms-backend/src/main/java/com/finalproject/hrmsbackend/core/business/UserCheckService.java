package com.finalproject.hrmsbackend.core.business;

public interface UserCheckService {

    boolean invalidEmail(String email);

    boolean invalidWebsite(String website);

    boolean invalidPhone(String phone);

}
