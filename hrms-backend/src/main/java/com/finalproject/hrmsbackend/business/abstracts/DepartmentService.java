package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Department;

import java.util.List;

public interface DepartmentService {

    DataResult<List<Department>> getAll();

    Result add(String departmentName);

}
