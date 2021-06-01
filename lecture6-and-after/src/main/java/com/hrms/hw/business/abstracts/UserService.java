package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;

import java.util.List;

public interface UserService<User,AddDto> {

    DataResult<List<User>> getAll();

    Result add(AddDto dto);
}

