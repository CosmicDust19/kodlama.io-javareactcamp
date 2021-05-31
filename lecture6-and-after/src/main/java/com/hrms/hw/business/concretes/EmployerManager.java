package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.EmployerCheckService;
import com.hrms.hw.business.abstracts.EmployerService;
import com.hrms.hw.core.abstracts.EmailService;
import com.hrms.hw.core.utilities.results.*;
import com.hrms.hw.dataAccess.abstracts.EmployerDao;
import com.hrms.hw.entities.concretes.Employer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDate;
import java.util.List;

@Service
public class EmployerManager implements EmployerService {

    private final EmployerDao employerDao;
    private final EmployerCheckService employerCheckService;
    private final EmailService emailService;

    @Autowired
    public EmployerManager(EmployerDao employerDao, EmployerCheckService employerCheckService, EmailService emailService) {
        this.employerDao = employerDao;
        this.employerCheckService = employerCheckService;
        this.emailService = emailService;
    }

    @Override
    public DataResult<List<Employer>> getAll() {
        return new SuccessDataResult<>("Success", employerDao.findAll());
    }

    @Override
    public Result add(Employer employer) {

        if (!employerCheckService.areAllFieldsFilled(employer)) {
            return new ErrorResult("There is empty fields");
        } else if (!employerCheckService.isCompatibleWebSiteAndEmail(employer)) {
            return new ErrorResult("Incompatible Web Site & E-mail!");
        }

        try {
            employer.setCreatedAt(LocalDate.now());
            emailService.sendVerificationMail(employer.getEmail());
            employerDao.save(employer);
            return new SuccessResult("Employer Saved, your account will be available after our employees confirmed you.");
        } catch (Exception exception) {
            exception.printStackTrace();
            return new ErrorResult("Registration Failed");
        }

    }


}
