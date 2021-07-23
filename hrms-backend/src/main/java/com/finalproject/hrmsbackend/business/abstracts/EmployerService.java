package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;

import java.util.List;

public interface EmployerService {

    DataResult<Boolean> existsByCompanyName(String companyName);

    DataResult<Boolean> existsByWebsite(String website);

    DataResult<Employer> getById(int emplId);

    DataResult<Employer> getByEmailAndPW(String email, String password);

    DataResult<List<Employer>> getAll();

    DataResult<List<Employer>> getVerified();

    DataResult<List<Employer>> getUnverified();

    Result add(EmployerAddDto employerAddDto);

    Result updateCompanyName(String companyName, int emplId);

    Result updateEmailAndWebsite(String website, String email, int emplId);

    Result updatePhoneNumber(String phoneNumber, int emplId);

    Result applyChanges(int emplId);

    Result updateVerification(boolean systemVerificationStatus, int emplId);

}
