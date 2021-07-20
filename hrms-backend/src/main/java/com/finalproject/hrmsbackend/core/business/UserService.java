package com.finalproject.hrmsbackend.core.business;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;

public interface UserService {

    DataResult<Boolean> existsByEmail(String email);

    DataResult<Boolean> existsByEmailAndPW(String email, String password);

    Result deleteById(int id);

    Result updateEmail(String email, int id);

    Result updatePW(String password, String oldPassword, int id);

}

