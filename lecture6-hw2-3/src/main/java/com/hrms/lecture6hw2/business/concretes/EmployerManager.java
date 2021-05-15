package com.hrms.lecture6hw2.business.concretes;

import com.hrms.lecture6hw2.business.abstracts.EmployerService;
import com.hrms.lecture6hw2.dataAccess.abstracts.EmployerDao;
import com.hrms.lecture6hw2.entities.concretes.Employer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployerManager implements EmployerService {

    private final EmployerDao employerDao;

    @Autowired
    public EmployerManager(EmployerDao employerDao) {
        this.employerDao = employerDao;
    }

    @Override
    public List<Employer> getAll() {
        return employerDao.findAll();
    }
}
