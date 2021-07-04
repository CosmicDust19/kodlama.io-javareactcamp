package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.business.UserService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;

import java.util.List;

public interface EmployerService extends UserService<Employer> {

    DataResult<Boolean> existsByEmailAndPassword(String email, String password);

    DataResult<Boolean> existsByCompanyName(String companyName);

    DataResult<Boolean> existsByWebsite(String website);

    DataResult<Employer> getById(int id);

    DataResult<Employer> getByEmailAndPassword(String email, String password);

    DataResult<List<Employer>> getAllBySystemVerificationStatusTrue();

    DataResult<List<Employer>> getAllBySystemVerificationStatusFalse();

    Result add(EmployerAddDto employerAddDto);

    DataResult<Boolean> deleteById(int id);

    Result updatePassword(String password, String oldPassword, int id);

    Result updateCompanyName(String companyName, int id);

    Result updateEmailAndWebsite(String website, String email, int id);

    Result updatePhoneNumber(String phoneNumber, int id);

    Result updateSystemVerificationStatus(boolean systemVerificationStatus, int id);

}
