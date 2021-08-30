package com.finalproject.hrmsbackend.core.business.concretes;

import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.business.abstracts.UserService;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.entities.User;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.EmployerDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SystemEmployeeDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserManager implements UserService {

    private final UserDao userDao;
    private final CandidateDao candidateDao;
    private final EmployerDao employerDao;
    private final SystemEmployeeDao sysEmplDao;
    private final CheckService check;
    private final EmailService emailService;

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
    public Result login(String email, String password) {
        if (candidateDao.existsByEmailAndPassword(email, password))
            return new SuccessDataResult<>(Msg.LOGGED_IN.get("candidate"), candidateDao.getByEmailAndPassword(email, password));
        if (employerDao.existsByEmailAndPassword(email, password))
            return new SuccessDataResult<>(Msg.LOGGED_IN.get("employer"), employerDao.getByEmailAndPassword(email, password));
        if (sysEmplDao.existsByEmailAndPassword(email, password))
            return new SuccessDataResult<>(Msg.LOGGED_IN.get("systemEmployee"), sysEmplDao.getByEmailAndPassword(email, password));
        return new ErrorResult(Msg.LOGIN_FAIL.get());
    }

    @Override
    public Result updateEmail(String email, int userId) {
        if (check.notExistsById(userDao, userId)) return new ErrorResult(Msg.NOT_EXIST.get("userId"));

        User user = userDao.getById(userId);
        if (user.getEmail().equals(email))
            return new ErrorResult(Msg.IS_THE_SAME.get("Email"));
        if (userDao.existsByEmail(email))
            return new ErrorResult(Msg.IS_IN_USE.get("Email"));

        user.setEmail(email);
        emailService.sendVerificationMail(email);
        return execLastUpdAct(user);
    }

    @Override
    public Result updatePW(String password, String oldPassword, int userId) {
        if (!userDao.existsByIdAndPassword(userId, oldPassword))
            return new ErrorResult(Msg.WRONG.getCustom("%s password"));
        if (password.equals(oldPassword))
            return new ErrorResult(Msg.IS_THE_SAME.get("Password"));

        User user = userDao.getById(userId);
        user.setPassword(password);
        return execLastUpdAct(user);
    }

    private Result execLastUpdAct(User user) {
        user.setLastModifiedAt(LocalDateTime.now());
        User savedUser = userDao.save(user);
        savedUser.setPassword(null);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedUser);
    }

}
