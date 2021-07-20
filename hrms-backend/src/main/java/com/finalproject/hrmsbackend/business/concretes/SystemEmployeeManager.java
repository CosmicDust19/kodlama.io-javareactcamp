package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.SystemEmployeeService;
import com.finalproject.hrmsbackend.core.business.CheckService;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SystemEmployeeDao;
import com.finalproject.hrmsbackend.entities.concretes.SystemEmployee;
import com.finalproject.hrmsbackend.entities.concretes.dtos.SystemEmployeesAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemEmployeeManager implements SystemEmployeeService {

    private final SystemEmployeeDao systemEmployeeDao;
    private final UserDao userDao;
    private final CheckService check;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<SystemEmployee>> getAll() {
        return new SuccessDataResult<>(systemEmployeeDao.findAll());
    }

    @Override
    public DataResult<SystemEmployee> getById(int id) {
        return new SuccessDataResult<>(systemEmployeeDao.getById(id));
    }

    @Override
    public DataResult<SystemEmployee> getByEmailAndPW(String email, String password) {
        return new SuccessDataResult<>(systemEmployeeDao.getByEmailAndPassword(email, password));
    }

    @Override
    public Result add(SystemEmployeesAddDto systemEmployeesAddDto) {
        SystemEmployee systemEmployee = modelMapper.map(systemEmployeesAddDto, SystemEmployee.class);
        systemEmployeeDao.save(systemEmployee);
        return new SuccessResult(MSGs.SAVED.get());
    }

    @Override
    public Result updateFirstName(String firstName, int id) {
        if (check.notExistsById(systemEmployeeDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        systemEmployeeDao.updateFirstName(firstName, id);
        userDao.updateLastModifiedAt(LocalDateTime.now(), id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateLastName(String lastName, int id) {
        if (check.notExistsById(systemEmployeeDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        systemEmployeeDao.updateLastName(lastName, id);
        userDao.updateLastModifiedAt(LocalDateTime.now(), id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

}
