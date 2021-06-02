package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;

import java.util.List;

public interface UserService<User> {

    DataResult<List<User>> getAll();

}

