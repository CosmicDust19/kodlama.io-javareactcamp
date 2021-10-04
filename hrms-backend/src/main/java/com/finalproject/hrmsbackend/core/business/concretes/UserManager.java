package com.finalproject.hrmsbackend.core.business.concretes;

import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.business.abstracts.UserCheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.UserService;
import com.finalproject.hrmsbackend.core.dataAccess.abstracts.UserDao;
import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.entities.User;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.EmployerDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.ImageDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SystemEmployeeDao;
import com.finalproject.hrmsbackend.entities.concretes.Image;
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
    private final ImageDao imageDao;
    private final UserCheckService userCheck;
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
        userCheck.existsUserById(userId);
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
        userCheck.existsUserById(userId);
        User user = userDao.getById(userId);
        check.notTheSame(user.getEmail(), email, "Email");
        userCheck.notExistsUserByEmail(email, null);
        user.setEmail(email);
        emailService.sendVerificationMail(email);
        return execLastUpdAct(user);
    }

    @Override
    public Result updatePW(String password, String oldPassword, int userId) {
        userCheck.existsUserByIdAndPW(oldPassword, userId);
        check.notTheSame(password, oldPassword, "Password");
        User user = userDao.getById(userId);
        user.setPassword(password);
        return execLastUpdAct(user);
    }

    @Override
    public Result updateProfileImg(Integer imgId, int userId) {
        userCheck.existsUserById(userId);
        User user = userDao.getById(userId);
        check.notTheSame(user.getProfileImg() != null ? user.getProfileImg().getId() : null, imgId, "Profile photo");
        for (Image img : user.getImages())
            if (imgId == null || CheckUtils.equals(img.getId(), imgId)) {
                user.setProfileImg(imgId == null ? null : imageDao.getById(imgId));
                return execLastUpdAct(user);
            }
        return new ErrorResult(Msg.NOT_HAVE.get("User"));
    }

    private Result execLastUpdAct(User user) {
        ErrorDataResult<ApiError> errors = Utils.getErrorsIfExist(check, userCheck);
        if (errors != null) return errors;
        user.setLastModifiedAt(LocalDateTime.now());
        User savedUser = userDao.save(user);
        savedUser.setPassword(null);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedUser);
    }

}
