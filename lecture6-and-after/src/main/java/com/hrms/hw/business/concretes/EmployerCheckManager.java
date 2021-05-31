package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.EmployerCheckService;
import com.hrms.hw.entities.concretes.Employer;
import org.springframework.stereotype.Service;

@Service
public class EmployerCheckManager implements EmployerCheckService {

    @Override
    public boolean areAllFieldsFilled(Employer employer) {
        return employer.getEmail() != null && employer.getPassword() != null && employer.getCompanyName() != null
                && employer.getWebsite() != null && employer.getPhoneNumber() != null;
    }

    //not working
    @Override
    public boolean isCompatibleWebSiteAndEmail(Employer employer) {
        String[] tempArr = employer.getEmail().split("@");

        //to avoid ArrayIndexOutOfBoundsException
        if (tempArr.length < 2) return false;

        String emailDomain = tempArr[1];
        String webSiteDomain = employer.getWebsite().substring(4);
        return emailDomain.equals(webSiteDomain);
    }

}
