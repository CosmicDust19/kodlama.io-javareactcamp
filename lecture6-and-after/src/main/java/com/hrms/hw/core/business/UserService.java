package com.hrms.hw.core.business;

import com.hrms.hw.core.utilities.results.DataResult;

import java.util.List;

public interface UserService<User> {

    DataResult<List<User>> getAll();

}

