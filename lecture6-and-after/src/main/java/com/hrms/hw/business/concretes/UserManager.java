package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.UserService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.dataAccess.abstracts.UserDao;
import com.hrms.hw.entities.concretes.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserManager implements UserService {

    private final UserDao userDao;

    @Autowired
    public UserManager(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public DataResult<List<User>> getAll() {
        return new SuccessDataResult<>("Success", userDao.findAll());
    }

}
