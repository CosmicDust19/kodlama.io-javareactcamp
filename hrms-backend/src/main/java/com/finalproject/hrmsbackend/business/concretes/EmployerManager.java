package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.EmployerCheckService;
import com.finalproject.hrmsbackend.business.abstracts.EmployerService;
import com.finalproject.hrmsbackend.core.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.business.CheckService;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.EmployerDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.EmployerUpdateDao;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.EmployerUpdate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmployerManager implements EmployerService {

    private final EmployerDao employerDao;
    private final EmployerUpdateDao employerUpdateDao;
    private final EmployerCheckService employerCheck;
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
    public DataResult<List<Employer>> getAllVerified() {
        return new SuccessDataResult<>(employerDao.getAllByVerifiedTrue());
    }

    @Override
    public DataResult<List<Employer>> getAllUnverified() {
        return new SuccessDataResult<>(employerDao.getAllByVerifiedFalse());
    }

    @Override
    public DataResult<Employer> getById(int id) {
        return new SuccessDataResult<>(employerDao.getById(id));
    }

    @Override
    public DataResult<Employer> getByEmailAndPW(String email, String password) {
        return new SuccessDataResult<>(employerDao.getByEmailAndPassword(email, password));
    }

    @Override
    public Result add(EmployerAddDto employerAddDto) {
        if (employerCheck.emailWebsiteDiffDomain(employerAddDto.getEmail(), employerAddDto.getWebsite()))
            return new ErrorResult(MSGs.DIFF_DOMAIN.get("email and website have"));

        employerAddDto.setPhoneNumber(Utils.getEditedPhoneNumber(employerAddDto.getPhoneNumber()));
        Employer employer = modelMapper.map(employerAddDto, Employer.class);

        employerDao.save(employer);
        emailService.sendVerificationMail(employerAddDto.getEmail());
        return new SuccessResult(MSGs.SAVED.getCustom("%s (needed verification)"));
    }

    @Override
    public Result deleteById(int id) {
        employerDao.deleteById(id);
        return new SuccessResult(MSGs.DELETED.get());
    }

    @Override
    public Result updateCompanyName(String companyName, int id) {
        if (check.notExistsById(employerDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        Employer employer = employerDao.getById(id);
        EmployerUpdate employerUpdate = employer.getEmployerUpdate();

        if ((employerUpdate != null && employerUpdate.getCompanyName().equals(companyName)) ||
                (employerUpdate == null && employer.getCompanyName().equals(companyName)))
            return new ErrorResult(MSGs.THE_SAME.get("companyName is"));

        handleLastActions(employer);
        employerUpdateDao.updateCompanyName(companyName, employer.getEmployerUpdate().getUpdateId());
        return getUpdateOutput(employer);
    }

    @Override
    public Result updateEmailAndWebsite(String email, String website, int id) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(employerDao, id)) errors.put("id", MSGs.NOT_EXIST.get());
        if (employerCheck.emailWebsiteDiffDomain(email, website)) errors.put("email - website", MSGs.DIFF_DOMAIN.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        Employer employer = employerDao.getById(id);
        EmployerUpdate employerUpdate = employer.getEmployerUpdate();

        boolean employerUpdateEmailSame = (employerUpdate != null && employerUpdate.getEmail().equals(email));
        boolean firstUpdateAndEmployerEmailSame = (employerUpdate == null && employer.getEmail().equals(email));
        boolean employerUpdateWebsiteSame = (employerUpdate != null && employerUpdate.getWebsite().equals(website));
        boolean firstUpdateAndEmployerWebsiteSame = (employerUpdate == null && employer.getWebsite().equals(website));

        if ((employerUpdateEmailSame || firstUpdateAndEmployerEmailSame) &&
                (employerUpdateWebsiteSame || firstUpdateAndEmployerWebsiteSame))
            return new ErrorResult(MSGs.THE_SAME.get("email and website are"));

        if (!employer.getEmail().equals(email) && userDao.existsByEmail(email))
            return new ErrorResult(MSGs.IN_USE.get("email is"));
        if (!employer.getWebsite().equals(website) && employerDao.existsByWebsite(website))
            return new ErrorResult(MSGs.IN_USE.get("website is"));

        handleLastActions(employer);
        employerUpdateDao.updateEmailAndWebsite(email, website, employer.getEmployerUpdate().getUpdateId());
        return getUpdateOutput(employer);
    }

    @Override
    public Result updatePhoneNumber(String phoneNumber, int id) {
        if (check.notExistsById(employerDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        Employer employer = employerDao.getById(id);
        EmployerUpdate employerUpdate = employer.getEmployerUpdate();

        if ((employerUpdate != null && employerUpdate.getPhoneNumber().equals(phoneNumber)) ||
                (employerUpdate == null && employer.getPhoneNumber().equals(phoneNumber)))
            return new ErrorResult(MSGs.THE_SAME.get("phoneNumber is"));

        handleLastActions(employer);
        employerUpdateDao.updatePhoneNumber(Utils.getEditedPhoneNumber(phoneNumber), employer.getEmployerUpdate().getUpdateId());
        return getUpdateOutput(employer);
    }

    @Override
    public Result applyUpdates(int empId) {
        if (check.notExistsById(employerDao, empId)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        Employer employer = employerDao.getById(empId);

        if (employer.getEmployerUpdate() == null) return new ErrorResult(MSGs.NO_UPDATE.get());
        employerDao.applyUpdates(employer.getEmployerUpdate(), empId);
        employerDao.updateUpdateVerification(true, empId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateVerification(boolean systemVerificationStatus, int id) {
        if (check.notExistsById(employerDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        employerDao.updateVerification(systemVerificationStatus, id);
        employerDao.updateRejection(!systemVerificationStatus, id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    public EmployerUpdate createEmployerUpdate(Employer employer) {
        EmployerUpdate employerUpdate = modelMapper.map(employer, EmployerUpdate.class);
        EmployerUpdate savedEmployerUpdate = employerUpdateDao.save(employerUpdate);
        employerDao.updateUpdateId(savedEmployerUpdate.getUpdateId(), employer.getId());
        return savedEmployerUpdate;
    }

    private void handleLastActions(Employer employer) {
        if (employer.getEmployerUpdate() == null) employer.setEmployerUpdate(createEmployerUpdate(employer));
        employerDao.updateUpdateVerification(false, employer.getId());
        userDao.updateLastModifiedAt(LocalDateTime.now(), employer.getId());
    }

    private SuccessDataResult<Integer> getUpdateOutput(Employer employer) {
        return new SuccessDataResult<>(MSGs.SUCCESS_UPDATE_REQUEST.get(), employer.getEmployerUpdate().getUpdateId());
    }

}
