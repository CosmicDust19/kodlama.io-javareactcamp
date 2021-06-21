package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.EmployerCheckService;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;
import org.springframework.stereotype.Service;

@Service
public class EmployerCheckManager implements EmployerCheckService {

    @Override
    public boolean isCompatibleWebSiteAndEmail(EmployerAddDto employerAddDto) {
        String emailDomain = employerAddDto.getEmail().substring(employerAddDto.getEmail().indexOf("@") + 1);
        return employerAddDto.getWebsite().contains(emailDomain);
    }

}
