package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.business.UserService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;

public interface EmployerService extends UserService<Employer> {

    DataResult<Boolean> existsByEmailAndPassword(String email, String password);

    DataResult<Employer> getById(int id);

    DataResult<Employer> getByEmailAndPassword(String email, String password);

    DataResult<Boolean> existsByCompanyName(String companyName);

    DataResult<Boolean> existsByWebsite(String website);

    Result add(EmployerAddDto employerAddDto);

}
