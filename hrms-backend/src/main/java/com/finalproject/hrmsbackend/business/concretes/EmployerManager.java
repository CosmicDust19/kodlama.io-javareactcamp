package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.EmployerService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.business.abstracts.UserCheckService;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorResult;
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
        if (userCheck.emailWebsiteDiffDomain(employerAddDto.getEmail(), employerAddDto.getWebsite()))
            return new ErrorResult(Msg.DIFF_DOMAIN.get("Email and website"));

        employerAddDto.setPhoneNumber(Utils.getEditedPhoneNumber(employerAddDto.getPhoneNumber()));

        Employer employer = modelMapper.map(employerAddDto, Employer.class);
        Employer savedEmployer = employerDao.save(employer);

        EmployerUpdate employerUpdate = modelMapper.map(savedEmployer, EmployerUpdate.class);
        EmployerUpdate savedEmployerUpdate = employerUpdateDao.save(employerUpdate);

        employerDao.updateUpdateId(savedEmployerUpdate.getUpdateId(), savedEmployer.getId());
        savedEmployer.setEmployerUpdate(savedEmployerUpdate);

        emailService.sendVerificationMail(employerAddDto.getEmail());
        return new SuccessDataResult<>(Msg.SAVED.get(), savedEmployer);
    }

    @Override
    public Result updateCompanyName(String companyName, int emplId) {
        if (check.notExistsById(employerDao, emplId)) return new ErrorResult(Msg.NOT_EXIST.get("emplId"));

        Employer employer = employerDao.getById(emplId);
        EmployerUpdate employerUpdate = employer.getEmployerUpdate();

        if (employerUpdate.getCompanyName().equals(companyName))
            return new ErrorResult(Msg.THE_SAME.get("Company name is"));

        employerUpdate.setCompanyName(companyName);

        EmployerUpdate savedEmplUpdate = employerUpdateDao.save(employerUpdate);
        execLastUpdAct(employer);
        employer.setEmployerUpdate(savedEmplUpdate);
        return new SuccessDataResult<>(Msg.SUCCESS_UPDATE_REQUEST.get(), employer);
    }

    @Override
    public Result updateEmailAndWebsite(String email, String website, int emplId) {
        if (check.notExistsById(employerDao, emplId))
            return new ErrorResult(Msg.NOT_EXIST.get("emplId"));
        if (userCheck.emailWebsiteDiffDomain(email, website))
            return new ErrorResult(Msg.DIFF_DOMAIN.get("Email and website"));

        Employer employer = employerDao.getById(emplId);
        EmployerUpdate employerUpdate = employer.getEmployerUpdate();

        if (employerUpdate.getEmail().equals(email) && employerUpdate.getWebsite().equals(website))
            return new ErrorResult(Msg.THE_SAME.get("Email and website are"));

        if (!employer.getEmail().equals(email) && userDao.existsByEmail(email))
            return new ErrorResult(Msg.IN_USE.get("Email is"));
        if (!employer.getWebsite().equals(website) && employerDao.existsByWebsite(website))
            return new ErrorResult(Msg.IN_USE.get("Website is"));

        employerUpdate.setEmail(email);
        employerUpdate.setWebsite(website);
        return execLastUpdAct(employer);
    }

    @Override
    public Result updatePhoneNumber(String phoneNumber, int emplId) {
        if (check.notExistsById(employerDao, emplId)) return new ErrorResult(Msg.NOT_EXIST.get("emplId"));

        Employer employer = employerDao.getById(emplId);
        EmployerUpdate employerUpdate = employer.getEmployerUpdate();

        if (employerUpdate.getPhoneNumber().equals(phoneNumber))
            return new ErrorResult(Msg.THE_SAME.get("Phone number is"));

        employerUpdate.setPhoneNumber(Utils.getEditedPhoneNumber(phoneNumber));
        return execLastUpdAct(employer);
    }

    @Override
    public Result applyChanges(int emplId) {
        if (check.notExistsById(employerDao, emplId)) return new ErrorResult(Msg.NOT_EXIST.get("emplId"));

        Employer employer = employerDao.getById(emplId);
        modelMapper.map(employer.getEmployerUpdate(), employer);
        employer.setUpdateVerified(true);
        Employer savedEmpl = employerDao.save(employer);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedEmpl);
    }

    @Override
    public Result updateVerification(boolean verificationStatus, int emplId) {
        if (check.notExistsById(employerDao, emplId)) return new ErrorResult(Msg.NOT_EXIST.get("emplId"));

        Employer employer = employerDao.getById(emplId);
        employer.setVerified(verificationStatus);
        employer.setRejected(!verificationStatus);
        Employer savedEmployer = employerDao.save(employer);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedEmployer);
    }

    private Result execLastUpdAct(Employer employer) {
        EmployerUpdate savedEmplUpdate = employerUpdateDao.save(employer.getEmployerUpdate());
        employerDao.updateUpdateVerification(false, employer.getId());
        userDao.updateLastModifiedAt(LocalDateTime.now(), employer.getId());
        employer.setEmployerUpdate(savedEmplUpdate);
        employer.setUpdateVerified(false);
        employer.setLastModifiedAt(LocalDateTime.now());
        return new SuccessDataResult<>(Msg.SUCCESS_UPDATE_REQUEST.get(), employer);
    }

}
