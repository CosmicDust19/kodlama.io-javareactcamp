package com.finalproject.hrmsbackend.core.business;

import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
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
    public Result deleteById(int id){
        userDao.deleteById(id);
        return new SuccessResult(MSGs.DELETED.get());
    }

    @Override
    public Result updateEmail(String email, int id) {
        if (check.notExistsById(userDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));
        if (userDao.existsByEmail(email)) return new ErrorResult(MSGs.IN_USE.get("email is"));

        userDao.updateEmail(email, id);
        userDao.updateLastModifiedAt(LocalDateTime.now(), id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updatePW(String password, String oldPassword, int id) {
        if (!userDao.existsByIdAndPassword(id, oldPassword)) return new ErrorResult(MSGs.WRONG.getCustom("%s oldPassword"));
        userDao.updatePassword(password, id);
        userDao.updateLastModifiedAt(LocalDateTime.now(), id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

}
