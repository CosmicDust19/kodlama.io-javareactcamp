package com.finalproject.hrmsbackend.core.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckManager;
import com.finalproject.hrmsbackend.core.business.abstracts.UserCheckService;
import com.finalproject.hrmsbackend.core.dataAccess.abstracts.UserDao;
import com.finalproject.hrmsbackend.core.entities.User;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.EntityNotExistsException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCheckManager extends BaseCheckManager implements UserCheckService {

    private final UserDao userDao;

    @SneakyThrows
    @Override
    public void existsUserById(Integer userId) {
        if (CheckUtils.notExistsById(userDao, userId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("User"));
    }

    @Override
    public void notExistsUserByEmail(String email, User user) {
        boolean usersEmail = user != null && user.getEmail().equals(email);
        if (!usersEmail && userDao.existsByEmail(email))
            errors.put("email", Msg.IS_IN_USE.get("Email"));
    }

    @Override
    public void existsUserByIdAndPW(String password, int userId) {
        if (!userDao.existsByIdAndPassword(userId, password))
            errors.put("password", Msg.WRONG.getCustom("%s password"));
    }

}
