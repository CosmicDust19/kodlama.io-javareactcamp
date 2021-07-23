package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.EmployerService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.business.abstracts.UserCheckService;
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
            return new ErrorResult(MSGs.DIFF_DOMAIN.get("email and website"));

        employerAddDto.setPhoneNumber(Utils.getEditedPhoneNumber(employerAddDto.getPhoneNumber()));
        Employer employer = modelMapper.map(employerAddDto, Employer.class);

        employerDao.save(employer);
        emailService.sendVerificationMail(employerAddDto.getEmail());
        return new SuccessResult(MSGs.SAVED.getCustom("%s (needed verification)"));
    }

    @Override
    public Result updateCompanyName(String companyName, int emplId) {
        if (check.notExistsById(employerDao, emplId)) return new ErrorResult(MSGs.NOT_EXIST.get("emplId"));

        Employer employer = employerDao.getById(emplId);
        EmployerUpdate employerUpdate = employer.getEmployerUpdate();

        if ((employerUpdate != null && employerUpdate.getCompanyName().equals(companyName)) ||
                (employerUpdate == null && employer.getCompanyName().equals(companyName)))
            return new ErrorResult(MSGs.THE_SAME.get("companyName is"));

        handleLastUpdateActions(employer);
        employerUpdateDao.updateCompanyName(companyName, employer.getEmployerUpdate().getUpdateId());
        return getUpdateOutput(employer);
    }

    @Override
    public Result updateEmailAndWebsite(String email, String website, int emplId) {
        if (check.notExistsById(employerDao, emplId))
            return new ErrorResult(MSGs.NOT_EXIST.get("emplId"));
        if (userCheck.emailWebsiteDiffDomain(email, website))
            return new ErrorResult(MSGs.DIFF_DOMAIN.get("email and website"));

        Employer employer = employerDao.getById(emplId);
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

        handleLastUpdateActions(employer);
        employerUpdateDao.updateEmailAndWebsite(email, website, employer.getEmployerUpdate().getUpdateId());
        return getUpdateOutput(employer);
    }

    @Override
    public Result updatePhoneNumber(String phoneNumber, int emplId) {
        if (check.notExistsById(employerDao, emplId)) return new ErrorResult(MSGs.NOT_EXIST.get("emplId"));

        Employer employer = employerDao.getById(emplId);
        EmployerUpdate employerUpdate = employer.getEmployerUpdate();

        if ((employerUpdate != null && employerUpdate.getPhoneNumber().equals(phoneNumber)) ||
                (employerUpdate == null && employer.getPhoneNumber().equals(phoneNumber)))
            return new ErrorResult(MSGs.THE_SAME.get("phoneNumber is"));

        handleLastUpdateActions(employer);
        employerUpdateDao.updatePhoneNumber(Utils.getEditedPhoneNumber(phoneNumber), employer.getEmployerUpdate().getUpdateId());
        return getUpdateOutput(employer);
    }

    @Override
    public Result applyChanges(int emplId) {
        if (check.notExistsById(employerDao, emplId)) return new ErrorResult(MSGs.NOT_EXIST.get("emplId"));

        Employer employer = employerDao.getById(emplId);

        if (employer.getEmployerUpdate() == null) return new ErrorResult(MSGs.NO_UPDATE.get());
        employerDao.applyUpdates(employer.getEmployerUpdate(), emplId);
        employerDao.updateUpdateVerification(true, emplId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateVerification(boolean verificationStatus, int emplId) {
        if (check.notExistsById(employerDao, emplId)) return new ErrorResult(MSGs.NOT_EXIST.get("emplId"));

        employerDao.updateVerification(verificationStatus, emplId);
        employerDao.updateRejection(!verificationStatus, emplId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    public EmployerUpdate createEmployerUpdate(Employer employer) {
        EmployerUpdate employerUpdate = modelMapper.map(employer, EmployerUpdate.class);
        EmployerUpdate savedEmployerUpdate = employerUpdateDao.save(employerUpdate);
        employerDao.updateUpdateId(savedEmployerUpdate.getUpdateId(), employer.getId());
        return savedEmployerUpdate;
    }

    private void handleLastUpdateActions(Employer employer) {
        if (employer.getEmployerUpdate() == null) employer.setEmployerUpdate(createEmployerUpdate(employer));
        employerDao.updateUpdateVerification(false, employer.getId());
        userDao.updateLastModifiedAt(LocalDateTime.now(), employer.getId());
    }

    private SuccessDataResult<Integer> getUpdateOutput(Employer employer) {
        return new SuccessDataResult<>(MSGs.SUCCESS_UPDATE_REQUEST.get(), employer.getEmployerUpdate().getUpdateId());
    }

}
