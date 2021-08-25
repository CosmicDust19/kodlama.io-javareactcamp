package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.DepartmentService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult;
import com.finalproject.hrmsbackend.dataAccess.abstracts.DepartmentDao;
import com.finalproject.hrmsbackend.entities.concretes.Department;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentManager implements DepartmentService {

    private final DepartmentDao departmentDao;

    @Override
    public DataResult<List<Department>> getAll() {
        return new SuccessDataResult<>(departmentDao.findAll());
    }

    @Override
    public Result add(String departmentName) {
        Department savedDepartment = departmentDao.save(new Department(departmentName));
        return new SuccessDataResult<>(Msg.SAVED.get(), savedDepartment);
    }
}
