package com.finalproject.hrmsbackend.core.business.abstracts;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckService;
import com.finalproject.hrmsbackend.core.entities.User;

import java.util.Map;

public interface UserCheckService extends BaseCheckService {

    Map<String, String> getErrors();

    void existsUserById(Integer userId);

    void notExistsUserByEmail(String email, User user);

    void existsUserByIdAndPW(String password, int userId);
}
