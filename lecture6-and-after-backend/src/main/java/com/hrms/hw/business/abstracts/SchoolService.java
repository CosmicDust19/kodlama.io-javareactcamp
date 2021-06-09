package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.School;

import java.util.List;

public interface SchoolService {
    DataResult<List<School>> getAll();

    Result add(School school);
}
