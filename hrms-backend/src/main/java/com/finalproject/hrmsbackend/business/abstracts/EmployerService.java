package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;

import java.util.List;

public interface EmployerService {

    DataResult<Boolean> existsByCompanyName(String companyName);

    DataResult<Boolean> existsByWebsite(String website);

    DataResult<Employer> getById(int id);

    DataResult<Employer> getByEmailAndPW(String email, String password);

    DataResult<List<Employer>> getAll();

    DataResult<List<Employer>> getAllVerified();

    DataResult<List<Employer>> getAllUnverified();

    Result add(EmployerAddDto employerAddDto);

    Result updateCompanyName(String companyName, int id);

    Result updateEmailAndWebsite(String website, String email, int id);

    Result updatePhoneNumber(String phoneNumber, int id);

    Result applyUpdates(int empId);

    Result updateVerification(boolean systemVerificationStatus, int id);

}
