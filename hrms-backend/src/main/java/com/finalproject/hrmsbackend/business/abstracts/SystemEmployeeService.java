package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.business.UserService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.SystemEmployee;
import com.finalproject.hrmsbackend.entities.concretes.dtos.SystemEmployeesAddDto;

public interface SystemEmployeeService extends UserService<SystemEmployee> {

    DataResult<Boolean> existsByEmailAndPassword(String email, String password);

    DataResult<SystemEmployee> getById(int id);

    DataResult<SystemEmployee> getByEmailAndPassword(String email, String password);

    Result add(SystemEmployeesAddDto systemEmployeesAddDto);

    DataResult<Boolean> deleteById(int id);

    Result updateEmail(String email, int id);

    Result updatePassword(String password, String oldPassword, int id);

    Result updateFirstName(String firstName, int id);

    Result updateLastName(String lastName, int id);
}
