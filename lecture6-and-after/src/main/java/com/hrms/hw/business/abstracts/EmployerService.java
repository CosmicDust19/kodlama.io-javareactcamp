package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.Employer;
import com.hrms.hw.entities.concretes.dtos.EmployerAddDto;

public interface EmployerService extends UserService<Employer>{
    Result add(EmployerAddDto employerAddDto);
}
