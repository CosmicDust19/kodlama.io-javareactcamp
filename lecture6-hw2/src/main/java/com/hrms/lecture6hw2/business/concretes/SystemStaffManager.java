package com.hrms.lecture6hw2.business.concretes;

import com.hrms.lecture6hw2.business.abstracts.SystemStaffService;
import com.hrms.lecture6hw2.dataAccess.abstracts.SystemStaffDao;
import com.hrms.lecture6hw2.entities.concretes.SystemStaff;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemStaffManager implements SystemStaffService {

    private final SystemStaffDao systemStaffDao;

    @Autowired
    public SystemStaffManager(SystemStaffDao systemStaffDao) {
        this.systemStaffDao = systemStaffDao;
    }

    @Override
    public List<SystemStaff> getAll() {
        return systemStaffDao.findAll();
    }
}
