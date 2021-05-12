package com.hrms.lecture6hw2.business.concretes;

import com.hrms.lecture6hw2.business.abstracts.SystemEmployeeService;
import com.hrms.lecture6hw2.dataAccess.abstracts.SystemEmployeeDao;
import com.hrms.lecture6hw2.entities.concretes.SystemEmployee;
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
    public List<SystemEmployee> getAll() {
        return systemEmployeeDao.findAll();
    }
}
