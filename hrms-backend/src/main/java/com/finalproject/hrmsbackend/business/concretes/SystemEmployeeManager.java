package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.SystemEmployeeService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.utilities.Msg;
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

    private final UserDao userDao;
    private final SystemEmployeeDao systemEmployeeDao;
    private final CheckService check;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<SystemEmployee>> getAll() {
        return new SuccessDataResult<>(systemEmployeeDao.findAll());
    }

    @Override
    public DataResult<SystemEmployee> getById(int sysEmplId) {
        return new SuccessDataResult<>(systemEmployeeDao.getById(sysEmplId));
    }

    @Override
    public DataResult<SystemEmployee> getByEmailAndPW(String email, String password) {
        return new SuccessDataResult<>(systemEmployeeDao.getByEmailAndPassword(email, password));
    }

    @Override
    public Result add(SystemEmployeesAddDto systemEmployeesAddDto) {
        if (userDao.existsByEmail(systemEmployeesAddDto.getEmail())) return new ErrorResult(Msg.IS_IN_USE.get("Email"));
        SystemEmployee systemEmployee = modelMapper.map(systemEmployeesAddDto, SystemEmployee.class);
        systemEmployeeDao.save(systemEmployee);
        return new SuccessResult(Msg.SAVED.get());
    }

    @Override
    public Result updateFirstName(String firstName, int sysEmplId) {
        if (check.notExistsById(systemEmployeeDao, sysEmplId)) return new ErrorResult(Msg.NOT_EXIST.get("sysEmplId"));

        SystemEmployee sysEmpl = systemEmployeeDao.getById(sysEmplId);
        if (sysEmpl.getFirstName().equals(firstName))
            return new ErrorResult(Msg.IS_THE_SAME.get("First name"));

        sysEmpl.setFirstName(firstName);
        return execLastUpdAct(sysEmpl);
    }

    @Override
    public Result updateLastName(String lastName, int sysEmplId) {
        if (check.notExistsById(systemEmployeeDao, sysEmplId)) return new ErrorResult(Msg.NOT_EXIST.get("sysEmplId"));

        SystemEmployee sysEmpl = systemEmployeeDao.getById(sysEmplId);
        if (sysEmpl.getLastName().equals(lastName))
            return new ErrorResult(Msg.IS_THE_SAME.get("Last name"));

        sysEmpl.setLastName(lastName);
        return execLastUpdAct(sysEmpl);
    }

    private Result execLastUpdAct(SystemEmployee sysEmpl) {
        sysEmpl.setLastModifiedAt(LocalDateTime.now());
        SystemEmployee savedSysEmpl = systemEmployeeDao.save(sysEmpl);
        savedSysEmpl.setPassword(null);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedSysEmpl);
    }

}
