package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.SystemEmployee;
import com.finalproject.hrmsbackend.entities.concretes.dtos.SystemEmployeesAddDto;

import java.util.List;

public interface SystemEmployeeService {

    DataResult<List<SystemEmployee>> getAll();

    DataResult<SystemEmployee> getById(int id);

    DataResult<SystemEmployee> getByEmailAndPW(String email, String password);

    Result add(SystemEmployeesAddDto systemEmployeesAddDto);

    Result deleteById(int id);

    Result updateFirstName(String firstName, int id);

    Result updateLastName(String lastName, int id);

}
