package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.EmployerCheckService;
import com.hrms.hw.business.abstracts.EmployerService;
import com.hrms.hw.core.abstracts.EmailService;
import com.hrms.hw.core.utilities.results.*;
import com.hrms.hw.dataAccess.abstracts.EmployerDao;
import com.hrms.hw.entities.concretes.Employer;
import com.hrms.hw.entities.concretes.dtos.EmployerAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployerManager implements EmployerService {

    private final EmployerDao employerDao;
    private final EmployerCheckService employerCheckService;
    private final EmailService emailService;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<Employer>> getAll() {
        return new SuccessDataResult<>("Success", employerDao.findAll());
    }

    @Override
    public Result add(EmployerAddDto employerAddDto) {

        if (!employerCheckService.isCompatibleWebSiteAndEmail(employerAddDto)) {
            return new ErrorResult("Incompatible Web Site & E-mail!");
        } else if (!employerAddDto.getPassword().equals(employerAddDto.getPasswordRepeat())){
            return new ErrorResult("Password repetition mismatch");
        }

        simplifyPhoneNumber(employerAddDto);
        Employer employer = modelMapper.map(employerAddDto, Employer.class);
        emailService.sendVerificationMail(employerAddDto.getEmail());

        try {
            employerDao.save(employer);
            return new SuccessResult("Employer Saved, your account will be available after our employees confirmed you.");
        } catch (Exception exception) {
            exception.printStackTrace();
            return new ErrorResult("An Error Has Occurred - Registration Failed");
        }
    }

    public void simplifyPhoneNumber(EmployerAddDto employerAddDto){
        String simplePhone = employerAddDto.getPhoneNumber().replaceAll("[\\s-]","");
        if (simplePhone.length() > 11 && simplePhone.charAt(0) != '+') simplePhone = "+" + simplePhone;
        employerAddDto.setPhoneNumber(simplePhone);
    }
}
