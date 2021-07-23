package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.DepartmentService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.DepartmentDao;
import com.finalproject.hrmsbackend.entities.concretes.Department;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentManager implements DepartmentService {

    private final DepartmentDao departmentDao;
    private final CheckService check;

    @Override
    public DataResult<List<Department>> getAll() {
        return new SuccessDataResult<>(departmentDao.findAll());
    }

    @Override
    public Result add(String departmentName) {
        departmentDao.save(new Department(departmentName));
        return new SuccessResult(MSGs.SAVED.get());
    }
}
