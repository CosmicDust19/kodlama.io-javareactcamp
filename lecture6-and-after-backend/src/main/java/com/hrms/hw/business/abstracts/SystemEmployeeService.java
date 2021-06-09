package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.business.UserService;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.SystemEmployee;
import com.hrms.hw.entities.concretes.dtos.SystemEmployeesAddDto;

public interface SystemEmployeeService extends UserService<SystemEmployee> {
    Result add(SystemEmployeesAddDto systemEmployeesAddDto);
}
