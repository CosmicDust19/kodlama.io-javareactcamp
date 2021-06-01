package com.hrms.hw.business.abstracts;

import com.hrms.hw.entities.concretes.Employer;
import com.hrms.hw.entities.concretes.dtos.EmployerAddDto;

public interface EmployerCheckService extends UserCheckService<Employer> {
    boolean isCompatibleWebSiteAndEmail(EmployerAddDto employerAddDto);
}
