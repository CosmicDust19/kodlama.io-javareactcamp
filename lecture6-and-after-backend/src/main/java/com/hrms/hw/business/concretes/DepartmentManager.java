package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.DepartmentService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.DepartmentDao;
import com.hrms.hw.entities.concretes.Department;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentManager implements DepartmentService {

    private final DepartmentDao departmentDao;


    @Override
    public DataResult<List<Department>> getAll() {
        return new SuccessDataResult<>("Success", departmentDao.findAll());
    }

    @Override
    public Result add(Department department) {
        departmentDao.save(department);
        return new SuccessResult("Success");
    }
}
