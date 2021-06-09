package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.SystemEmployeeService;
import com.hrms.hw.core.utilities.results.*;
import com.hrms.hw.dataAccess.abstracts.SystemEmployeeDao;
import com.hrms.hw.entities.concretes.SystemEmployee;
import com.hrms.hw.entities.concretes.dtos.SystemEmployeesAddDto;
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
    public Result add(SystemEmployeesAddDto systemEmployeesAddDto) {
        if (!systemEmployeesAddDto.getPassword().equals(systemEmployeesAddDto.getPasswordRepeat()))
            return new ErrorResult("Password repetition mismatch.");

        SystemEmployee systemEmployee = modelMapper.map(systemEmployeesAddDto, SystemEmployee.class);
        systemEmployeeDao.save(systemEmployee);
        return new SuccessResult("System Employee Saved");
    }
}
