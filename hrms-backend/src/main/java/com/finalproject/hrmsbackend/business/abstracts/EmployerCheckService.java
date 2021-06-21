package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.business.UserCheckService;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;

public interface EmployerCheckService extends UserCheckService<Employer> {
    boolean isCompatibleWebSiteAndEmail(EmployerAddDto employerAddDto);
}
