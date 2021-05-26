package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.SystemEmployeeService;
import com.hrms.hw.core.utilities.results.*;
import com.hrms.hw.dataAccess.abstracts.SystemEmployeeDao;
import com.hrms.hw.entities.concretes.SystemEmployee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemEmployeeManager implements SystemEmployeeService {

    private final SystemEmployeeDao systemEmployeeDao;

    @Autowired
    public SystemEmployeeManager(SystemEmployeeDao systemEmployeeDao) {
        this.systemEmployeeDao = systemEmployeeDao;
    }

    @Override
    public DataResult<List<SystemEmployee>> getAll() {
        return new SuccessDataResult<>("Success", systemEmployeeDao.findAll());
    }

    @Override
    public Result add(SystemEmployee systemEmployee) {

        try {
            systemEmployeeDao.save(systemEmployee);
            return new SuccessResult("System Employee Saved");
        } catch (Exception exception){
            exception.printStackTrace();
            return new ErrorResult("Registration Failed");
        }

    }
}
