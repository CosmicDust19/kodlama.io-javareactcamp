package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.EmployerCheckService;
import com.finalproject.hrmsbackend.business.abstracts.EmployerService;
import com.finalproject.hrmsbackend.core.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.EmployerDao;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class EmployerManager implements EmployerService {

    private final EmployerDao employerDao;
    private final EmployerCheckService employerCheckService;
    private final EmailService emailService;
    private final ModelMapper modelMapper;
    private final UserDao userDao;

    @Override
    public DataResult<Boolean> existsByEmailAndPassword(String email, String password) {
        return new SuccessDataResult<>("Success", employerDao.existsByEmailAndPassword(email, password));
    }

    @Override
    public DataResult<Boolean> existsByEmail(String email) {
        return new SuccessDataResult<>("Success", employerDao.existsByEmail(email));
    }

    @Override
    public DataResult<Boolean> existsByCompanyName(String companyName) {
        return new SuccessDataResult<>("Success", employerDao.existsByCompanyName(companyName));
    }

    @Override
    public DataResult<Boolean> existsByWebsite(String website) {
        return new SuccessDataResult<>("Success", employerDao.existsByWebsite(website));
    }

    @Override
    public DataResult<List<Employer>> getAll() {
        return new SuccessDataResult<>("Success", employerDao.findAll());
    }

    @Override
    public DataResult<List<Employer>> getAllBySystemVerificationStatusTrue() {
        return new SuccessDataResult<>("Success", employerDao.getAllBySystemVerificationStatusTrue());
    }

    @Override
    public DataResult<List<Employer>> getAllBySystemVerificationStatusFalse() {
        return new SuccessDataResult<>("Success", employerDao.getAllBySystemVerificationStatusFalse());
    }

    @Override
    public DataResult<Employer> getById(int id) {
        if (id <= 0 || !employerDao.existsById(id)) {
            return new ErrorDataResult<>("id does not exist");
        }
        return new SuccessDataResult<>("Success", employerDao.getById(id));
    }

    @Override
    public DataResult<Employer> getByEmailAndPassword(String email, String password) {
        return new SuccessDataResult<>("Success", employerDao.getByEmailAndPassword(email, password));
    }

    @Override
    public Result add(EmployerAddDto employerAddDto) {
        if (!employerCheckService.isCompatibleEmailAndWebSite(employerAddDto.getEmail(), employerAddDto.getWebsite())) {
            return new ErrorResult("Incompatible Web Site & E-mail!");
        }
        simplifyPhoneNumber(employerAddDto);
        Employer employer = modelMapper.map(employerAddDto, Employer.class);
        emailService.sendVerificationMail(employerAddDto.getEmail());
        employerDao.save(employer);
        return new SuccessResult("Employer Saved, your account will be available after our employees confirmed you.");
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        if (id <= 0 || !employerDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        employerDao.deleteById(id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updatePassword(String password, String oldPassword, int id) {
        if (password != null) password = password.trim();
        Map<String, String> errors = new HashMap<>();
        if (!userDao.existsByIdAndPassword(id, oldPassword))
            errors.put("oldPassword", "wrong");
        if (id <= 0 || !employerDao.existsById(id))
            errors.put("id", "does not exist");
        if (password == null || password.length() < 6 || password.length() > 20)
            errors.put("password", "should be a text between 6 and 20 long");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        employerDao.updatePassword(password, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateCompanyName(String companyName, int id) {
        if (companyName != null) companyName = companyName.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !employerDao.existsById(id))
            errors.put("id", "does not exist");
        if (companyName == null || companyName.length() > 100)
            errors.put("companyName", "invalid companyName");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        if (employerDao.existsByCompanyName(companyName))
            return new ErrorResult("companyName in use");
        employerDao.updateCompanyName(companyName, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateEmailAndWebsite(String email, String website, int id) {
        if (website != null) website = website.trim();
        if (email != null) email = email.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !employerDao.existsById(id))
            errors.put("id", "does not exist");
        if (website == null || website.length() > 200 || !Pattern.matches("^[\\w\\d-_?%$+#!^><|`é]+(\\.[\\w\\d-_?%$+#!^><|`é]+)+$", website))
            errors.put("website", "invalid website");
        if (email == null || email.length() < 4 || email.length() > 100 ||
                !Pattern.matches("^\\w+(\\.\\w+)*@[a-zA-Z]+(\\.\\w{2,6})+$", email))
            errors.put("email", "invalid email");
        if (!employerCheckService.isCompatibleEmailAndWebSite(email, website))
            errors.put("email-website", "email and website should have the same domain");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        if (userDao.existsByEmail(email) || employerDao.existsByWebsite(website))
            return new ErrorResult("email, website or both in use");
        employerDao.updateWebsite(website, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updatePhoneNumber(String phoneNumber, int id) {
        if (phoneNumber != null) phoneNumber = phoneNumber.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !employerDao.existsById(id))
            errors.put("id", "does not exist");
        if (phoneNumber == null || phoneNumber.length() < 10 || phoneNumber.length() > 22 ||
                !Pattern.matches("^((\\+\\d{1,3})?0?[\\s-]?)?\\(?0?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}$", phoneNumber))
            errors.put("phoneNumber", "invalid phoneNumber");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        employerDao.updatePhoneNumber(phoneNumber, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateSystemVerificationStatus(boolean systemVerificationStatus, int id) {
        if (id <= 0 || !employerDao.existsById(id))
            return new ErrorResult("id: does not exist");
        employerDao.updateSystemVerificationStatus(systemVerificationStatus, id);
        employerDao.updateSystemRejectionStatus(!systemVerificationStatus, id);
        return new SuccessResult("Success");
    }

    public void simplifyPhoneNumber(EmployerAddDto employerAddDto) {
        String simplePhone = employerAddDto.getPhoneNumber().replaceAll("[\\s-]", "");
        if (simplePhone.length() > 11 && simplePhone.charAt(0) != '+') simplePhone = "+" + simplePhone;
        employerAddDto.setPhoneNumber(simplePhone);
    }
}
