package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.EmployerService;
import com.finalproject.hrmsbackend.business.abstracts.check.EmployerCheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.business.abstracts.UserCheckService;
import com.finalproject.hrmsbackend.core.dataAccess.abstracts.UserDao;
import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult;
import com.finalproject.hrmsbackend.dataAccess.abstracts.EmployerDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.EmployerUpdateDao;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.EmployerUpdate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployerManager implements EmployerService {

    private final EmployerDao employerDao;
    private final EmployerUpdateDao employerUpdateDao;
    private final UserCheckService userCheck;
    private final CheckService check;
    private final EmployerCheckService employerCheck;
    private final EmailService emailService;
    private final ModelMapper modelMapper;
    private final UserDao userDao;

    @Override
    public DataResult<Boolean> existsByCompanyName(String companyName) {
        return new SuccessDataResult<>(employerDao.existsByCompanyName(companyName));
    }

    @Override
    public DataResult<Boolean> existsByWebsite(String website) {
        return new SuccessDataResult<>(employerDao.existsByWebsite(website));
    }

    @Override
    public DataResult<List<Employer>> getAll() {
        return new SuccessDataResult<>(employerDao.findAll());
    }

    @Override
    public DataResult<List<Employer>> getVerified() {
        return new SuccessDataResult<>(employerDao.getAllByVerifiedTrue());
    }

    @Override
    public DataResult<List<Employer>> getUnverified() {
        return new SuccessDataResult<>(employerDao.getAllByVerifiedFalse());
    }

    @Override
    public DataResult<Employer> getById(int emplId) {
        return new SuccessDataResult<>(employerDao.getById(emplId));
    }

    @Override
    public DataResult<Employer> getByEmailAndPW(String email, String password) {
        return new SuccessDataResult<>(employerDao.getByEmailAndPassword(email, password));
    }

    @Override
    public Result add(EmployerAddDto employerAddDto) {
        userCheck.notExistsUserByEmail(employerAddDto.getEmail(), null);
        employerCheck.notExistsEmployerByCompanyName(employerAddDto.getCompanyName(), null);
        employerCheck.notExistsEmployerByWebsite(employerAddDto.getWebsite(), null);
        employerCheck.emailWebsiteHaveTheSameDomain(employerAddDto.getEmail(), employerAddDto.getWebsite());
        ErrorDataResult<ApiError> errors = Utils.getErrorsIfExist(userCheck, employerCheck);
        if (errors != null) return errors;

        emailService.sendVerificationMail(employerAddDto.getEmail());
        employerAddDto.setPhoneNumber(Utils.getEditedPhoneNumber(employerAddDto.getPhoneNumber()));
        Employer employer = modelMapper.map(employerAddDto, Employer.class);
        Employer savedEmployer = employerDao.save(employer);
        EmployerUpdate employerUpdate = modelMapper.map(savedEmployer, EmployerUpdate.class);
        EmployerUpdate savedEmployerUpdate = employerUpdateDao.save(employerUpdate);

        employerDao.updateUpdateId(savedEmployerUpdate.getUpdateId(), savedEmployer.getId());
        savedEmployer.setEmployerUpdate(savedEmployerUpdate);
        savedEmployer.setPassword(null);
        return new SuccessDataResult<>(Msg.SAVED.get(), savedEmployer);
    }

    @Override
    public Result updateCompanyName(String companyName, int emplId) {
        employerCheck.existsEmployerById(emplId);
        Employer employer = employerDao.getById(emplId);
        check.notTheSame(employer.getEmployerUpdate().getCompanyName(), companyName, "Company name");
        employerCheck.notExistsEmployerByCompanyName(companyName, employer);
        employer.getEmployerUpdate().setCompanyName(companyName);
        return execLastUpdAct(employer);
    }

    @Override
    public Result updateEmailAndWebsite(String email, String website, int emplId) {
        employerCheck.existsEmployerById(emplId);
        Employer employer = employerDao.getById(emplId);
        userCheck.notExistsUserByEmail(email, employer);
        employerCheck.emailWebsiteHaveTheSameDomain(email, website);
        employerCheck.notTheSameEmailAndWebsite(email, website, employer.getEmployerUpdate());
        employerCheck.notExistsEmployerByWebsite(website, employer);
        employerCheck.emailIsNotRequested(email, employer); //by another company
        employerCheck.websiteIsNotRequested(website, employer);
        employer.getEmployerUpdate().setEmail(email);
        employer.getEmployerUpdate().setWebsite(website);
        return execLastUpdAct(employer);
    }

    @Override
    public Result updatePhoneNumber(String phoneNumber, int emplId) {
        employerCheck.existsEmployerById(emplId);
        Employer employer = employerDao.getById(emplId);
        check.notTheSame(employer.getEmployerUpdate().getPhoneNumber(), phoneNumber, "Phone number");
        employer.getEmployerUpdate().setPhoneNumber(Utils.getEditedPhoneNumber(phoneNumber));
        return execLastUpdAct(employer);
    }

    @Override
    public Result applyChanges(int emplId) {
        employerCheck.existsEmployerById(emplId);
        Employer employer = employerDao.getById(emplId);
        modelMapper.map(employer.getEmployerUpdate(), employer);
        employer.setUpdateVerified(true);
        Employer savedEmpl = employerDao.save(employer);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedEmpl);
    }

    @Override
    public Result updateVerification(boolean verificationStatus, int emplId) {
        employerCheck.existsEmployerById(emplId);
        Employer employer = employerDao.getById(emplId);
        employer.setVerified(verificationStatus);
        employer.setRejected(!verificationStatus);
        Employer savedEmployer = employerDao.save(employer);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedEmployer);
    }

    private Result execLastUpdAct(Employer employer) {
        ErrorDataResult<ApiError> errors = Utils.getErrorsIfExist(employerCheck, check, userCheck);
        if (errors != null) return errors;
        boolean noChange = !employerCheck.changed(employer);
        EmployerUpdate savedEmplUpdate = employerUpdateDao.save(employer.getEmployerUpdate());
        employerDao.updateUpdateVerification(noChange, employer.getId());
        userDao.updateLastModifiedAt(LocalDateTime.now(), employer.getId());
        employer.setEmployerUpdate(savedEmplUpdate);
        employer.setUpdateVerified(noChange);
        employer.setLastModifiedAt(LocalDateTime.now());
        employer.setPassword(null);
        return new SuccessDataResult<>(Msg.SUCCESS_UPDATE_REQUEST.get(), employer);
    }

}
