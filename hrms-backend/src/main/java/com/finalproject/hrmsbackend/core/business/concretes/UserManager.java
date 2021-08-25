package com.finalproject.hrmsbackend.core.business.concretes;

import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.UserService;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.entities.User;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserManager implements UserService {

    private final UserDao userDao;
    private final CheckService check;

    @Override
    public DataResult<Boolean> existsByEmail(String email) {
        return new SuccessDataResult<>(userDao.existsByEmail(email));
    }

    @Override
    public DataResult<Boolean> existsByEmailAndPW(String email, String password) {
        return new SuccessDataResult<>(userDao.existsByEmailAndPassword(email, password));
    }

    @Override
    public Result deleteById(int userId) {
        userDao.deleteById(userId);
        return new SuccessResult(Msg.DELETED.get());
    }

    @Override
    public Result updateEmail(String email, int userId) {
        if (check.notExistsById(userDao, userId)) return new ErrorResult(Msg.NOT_EXIST.get("userId"));
        if (userDao.existsByEmail(email)) return new ErrorResult(Msg.IN_USE.get("Email is"));

        User user = userDao.getById(userId);
        user.setEmail(email);
        return execLastUpdAct(user);
    }

    @Override
    public Result updatePW(String password, String oldPassword, int userId) {
        if (!userDao.existsByIdAndPassword(userId, oldPassword))
            return new ErrorResult(Msg.WRONG.getCustom("%s password"));

        User user = userDao.getById(userId);
        user.setPassword(password);
        return execLastUpdAct(user);
    }

    private Result execLastUpdAct(User user) {
        user.setLastModifiedAt(LocalDateTime.now());
        User savedUser = userDao.save(user);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedUser);
    }

}
