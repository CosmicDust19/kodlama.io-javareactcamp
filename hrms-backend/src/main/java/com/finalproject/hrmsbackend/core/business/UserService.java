package com.finalproject.hrmsbackend.core.business;


import com.finalproject.hrmsbackend.core.utilities.results.DataResult;

import java.util.List;

public interface UserService<User> {

    DataResult<List<User>> getAll();

}

