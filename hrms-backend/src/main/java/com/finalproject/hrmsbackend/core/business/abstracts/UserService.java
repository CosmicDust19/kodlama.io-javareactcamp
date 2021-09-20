package com.finalproject.hrmsbackend.core.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;

public interface UserService {

    DataResult<Boolean> existsByEmail(String email);

    DataResult<Boolean> existsByEmailAndPW(String email, String password);

    Result deleteById(int userId);

    Result login(String email, String password);

    Result updateEmail(String email, int userId);

    Result updatePW(String password, String oldPassword, int userId);

    Result updateProfileImg(Integer imgId, int userId);
}

