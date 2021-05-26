package com.hrms.hw.business.abstracts;

import com.hrms.hw.entities.concretes.Employer;
import org.springframework.stereotype.Service;

@Service
public interface EmployerCheckService {

    boolean areAllFieldsFilled(Employer employer);

    boolean isCompatibleWebSiteAndEmail(Employer employer);
}
