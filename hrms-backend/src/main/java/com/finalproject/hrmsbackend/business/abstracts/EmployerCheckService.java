package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.business.UserCheckService;
import com.finalproject.hrmsbackend.entities.concretes.Employer;

public interface EmployerCheckService extends UserCheckService<Employer> {
    boolean isCompatibleEmailAndWebSite(String email, String website);
}
