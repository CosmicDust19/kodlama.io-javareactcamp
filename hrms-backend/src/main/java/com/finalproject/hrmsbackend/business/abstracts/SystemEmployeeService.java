package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.SystemEmployee;
import com.finalproject.hrmsbackend.entities.concretes.dtos.SystemEmployeeAddDto;

import java.util.List;

public interface SystemEmployeeService {

    DataResult<List<SystemEmployee>> getAll();

    DataResult<SystemEmployee> getById(int sysEmplId);

    DataResult<SystemEmployee> getByEmailAndPW(String email, String password);

    Result add(SystemEmployeeAddDto systemEmployeeAddDto);

    Result updateFirstName(String firstName, int sysEmplId);

    Result updateLastName(String lastName, int sysEmplId);

}
