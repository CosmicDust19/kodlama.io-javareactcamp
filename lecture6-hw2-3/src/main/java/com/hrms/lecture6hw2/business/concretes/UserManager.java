package com.hrms.lecture6hw2.business.concretes;

import com.hrms.lecture6hw2.business.abstracts.UserService;
import com.hrms.lecture6hw2.dataAccess.abstracts.UserDao;
import com.hrms.lecture6hw2.entities.concretes.User;
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
    public List<User> getAll() {
        return userDao.findAll();
    }
}
