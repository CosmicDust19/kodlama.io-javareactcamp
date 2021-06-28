package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.SystemEmployeeService;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SystemEmployeeDao;
import com.finalproject.hrmsbackend.entities.concretes.SystemEmployee;
import com.finalproject.hrmsbackend.entities.concretes.dtos.SystemEmployeesAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemEmployeeManager implements SystemEmployeeService {

    private final SystemEmployeeDao systemEmployeeDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<SystemEmployee>> getAll() {
        return new SuccessDataResult<>("Success", systemEmployeeDao.findAll());
    }

    @Override
    public DataResult<Boolean> existsByEmailAndPassword(String email, String password) {
        return new SuccessDataResult<>("Success", systemEmployeeDao.existsByEmailAndPassword(email, password));
    }

    @Override
    public DataResult<Boolean> existsByEmail(String email) {
        return new SuccessDataResult<>("Success", systemEmployeeDao.existsByEmail(email));
    }

    @Override
    public DataResult<SystemEmployee> getById(int id) {
        if (!systemEmployeeDao.existsById(id)){
            return new ErrorDataResult<>("id does not exist");
        }
        return new SuccessDataResult<>("Success", systemEmployeeDao.getById(id));
    }

    @Override
    public DataResult<SystemEmployee> getByEmailAndPassword(String email, String password) {
        return new SuccessDataResult<>("Success", systemEmployeeDao.getByEmailAndPassword(email, password));
    }

    @Override
    public Result add(SystemEmployeesAddDto systemEmployeesAddDto) {
        SystemEmployee systemEmployee = modelMapper.map(systemEmployeesAddDto, SystemEmployee.class);
        systemEmployeeDao.save(systemEmployee);
        return new SuccessResult("System Employee Saved");
    }

}
