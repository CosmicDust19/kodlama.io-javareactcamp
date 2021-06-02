package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.UserService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.dataAccess.abstracts.UserDao;
import com.hrms.hw.core.entities.User;
import com.hrms.hw.entities.concretes.dtos.UserAddDto;
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
