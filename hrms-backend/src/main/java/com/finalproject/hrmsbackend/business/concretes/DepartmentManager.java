package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.DepartmentService;
import com.finalproject.hrmsbackend.core.business.CheckService;
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
    public Result add(Department department) {
        if (department.getName() != null) department.setName(department.getName().trim());
        if (check.invalidLength(department.getName(), 0, 100)) return new ErrorResult(MSGs.INVALID.get("departmentName"));
        departmentDao.save(department);
        return new SuccessResult(MSGs.SAVED.get());
    }
}
