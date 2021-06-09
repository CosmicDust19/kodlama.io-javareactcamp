package com.hrms.hw.core.business;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.dataAccess.UserDao;
import com.hrms.hw.core.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserManager implements UserService<User> {

    private final UserDao userDao;

    @Override
    public DataResult<List<User>> getAll() {
        return new SuccessDataResult<>("Success", userDao.findAll());
    }

}
