package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.SystemEmployeeService;
import com.finalproject.hrmsbackend.business.abstracts.check.SystemEmployeeCheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.UserCheckService;
import com.finalproject.hrmsbackend.core.dataAccess.abstracts.UserDao;
import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SystemEmployeeDao;
import com.finalproject.hrmsbackend.entities.concretes.SystemEmployee;
import com.finalproject.hrmsbackend.entities.concretes.dtos.SystemEmployeeAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemEmployeeManager implements SystemEmployeeService {

    private final SystemEmployeeDao systemEmployeeDao;
    private final ModelMapper modelMapper;
    private final SystemEmployeeCheckService systemEmployeeCheck;
    private final CheckService check;
    private final UserCheckService userCheck;

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
    public Result add(SystemEmployeeAddDto systemEmployeeAddDto) {
        userCheck.notExistsUserByEmail(systemEmployeeAddDto.getEmail(), null);
        SystemEmployee systemEmployee = modelMapper.map(systemEmployeeAddDto, SystemEmployee.class);
        SystemEmployee savedSysEml = systemEmployeeDao.save(systemEmployee);
        savedSysEml.setPassword(null);
        return new SuccessDataResult<>(Msg.SAVED.get(), savedSysEml);
    }

    @Override
    public Result updateFirstName(String firstName, int sysEmplId) {
        systemEmployeeCheck.existsSystemEmployeeById(sysEmplId);
        SystemEmployee sysEmpl = systemEmployeeDao.getById(sysEmplId);
        check.notTheSame(sysEmpl.getFirstName(), firstName, "First name");
        sysEmpl.setFirstName(firstName);
        return execLastUpdAct(sysEmpl);
    }

    @Override
    public Result updateLastName(String lastName, int sysEmplId) {
        systemEmployeeCheck.existsSystemEmployeeById(sysEmplId);
        SystemEmployee sysEmpl = systemEmployeeDao.getById(sysEmplId);
        check.notTheSame(sysEmpl.getLastName(), lastName, "Last name");
        sysEmpl.setLastName(lastName);
        return execLastUpdAct(sysEmpl);
    }

    private Result execLastUpdAct(SystemEmployee sysEmpl) {
        ErrorDataResult<ApiError> errors = Utils.getErrorsIfExist(check, systemEmployeeCheck);
        if (errors != null) return errors;
        sysEmpl.setLastModifiedAt(LocalDateTime.now());
        SystemEmployee savedSysEmpl = systemEmployeeDao.save(sysEmpl);
        savedSysEmpl.setPassword(null);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedSysEmpl);
    }

}
