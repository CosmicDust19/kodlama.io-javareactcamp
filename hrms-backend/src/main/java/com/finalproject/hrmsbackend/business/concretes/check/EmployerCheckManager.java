package com.finalproject.hrmsbackend.business.concretes.check;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckManager;
import com.finalproject.hrmsbackend.business.abstracts.check.EmployerCheckService;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.UserCheckUtils;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.EntityNotExistsException;
import com.finalproject.hrmsbackend.dataAccess.abstracts.EmployerDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.EmployerUpdateDao;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.EmployerUpdate;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployerCheckManager extends BaseCheckManager implements EmployerCheckService {

    private final EmployerDao employerDao;
    private final EmployerUpdateDao employerUpdateDao;

    @SneakyThrows
    @Override
    public void existsEmployerById(Integer employerId) {
        if (CheckUtils.notExistsById(employerDao, employerId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("Employer"));
    }

    @Override
    public void notExistsEmployerByCompanyName(String companyName, Employer employer) {
        boolean employersCompanyName = employer != null && employer.getCompanyName().equals(companyName);
        if (!employersCompanyName && employerDao.existsByCompanyName(companyName))
            errors.put("companyName", Msg.IS_IN_USE.get("Company Name"));
    }

    @Override
    public void notExistsEmployerByWebsite(String website, Employer employer) {
        boolean employersWebsite = employer != null && employer.getWebsite().equals(website);
        if (!employersWebsite && employerDao.existsByWebsite(website))
            errors.put("website", Msg.IS_IN_USE.get("Website"));
    }

    // requested by another company*
    @Override
    public void companyNameIsNotRequested(String companyName, Employer employer) {
        // was this company name requested by this employer itself ?
        boolean employersRequestedCompanyName = employer != null && employer.getEmployerUpdate().getCompanyName().equals(companyName);
        if (!employersRequestedCompanyName && employerUpdateDao.existsByCompanyName(companyName))
            errors.put("companyName", Msg.REQUESTED.get("This company name"));
    }

    @Override
    public void emailIsNotRequested(String email, Employer employer) {
        boolean employersRequestedEmail = employer != null && employer.getEmployerUpdate().getEmail().equals(email);
        if (!employersRequestedEmail && employerUpdateDao.existsByEmail(email))
            errors.put("email", Msg.REQUESTED.get("This email"));
    }

    @Override
    public void websiteIsNotRequested(String website, Employer employer) {
        boolean employersRequestedWebsite = employer != null && employer.getEmployerUpdate().getWebsite().equals(website);
        if (!employersRequestedWebsite && employerUpdateDao.existsByWebsite(website))
            errors.put("website", Msg.REQUESTED.get("This website"));
    }

    @Override
    public void emailWebsiteHaveTheSameDomain(String email, String website) {
        if (UserCheckUtils.emailWebsiteDiffDomain(email, website))
            errors.put("domain", Msg.DIFF_DOMAIN.get("Email and website"));
    }

    @Override
    public void notTheSameEmailAndWebsite(String email, String website, EmployerUpdate employerUpdate) {
        if (employerUpdate.getEmail().equals(email) && employerUpdate.getWebsite().equals(website))
            errors.put("emailAndWebsite", Msg.THE_SAME.get("Email and website are"));
    }

    @Override
    public boolean changed(Employer employer) {
        EmployerUpdate emplUpd = employer.getEmployerUpdate();
        return !(CheckUtils.equals(emplUpd.getCompanyName(), employer.getCompanyName()) &&
                CheckUtils.equals(emplUpd.getEmail(), employer.getEmail()) &&
                CheckUtils.equals(emplUpd.getWebsite(), employer.getWebsite()) &&
                CheckUtils.equals(emplUpd.getPhoneNumber(), employer.getPhoneNumber()));
    }

}
