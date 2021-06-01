package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.EmployerCheckService;
import com.hrms.hw.entities.concretes.dtos.EmployerAddDto;
import org.springframework.stereotype.Service;

@Service
public class EmployerCheckManager implements EmployerCheckService {

    @Override
    public boolean isCompatibleWebSiteAndEmail(EmployerAddDto employerAddDto) {
        String emailDomain = employerAddDto.getEmail().substring(employerAddDto.getEmail().indexOf("@") + 1);
        return employerAddDto.getWebsite().contains(emailDomain);
    }

}
