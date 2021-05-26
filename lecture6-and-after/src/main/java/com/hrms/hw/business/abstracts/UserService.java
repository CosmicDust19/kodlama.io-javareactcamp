package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {

    DataResult<List<User>> getAll();
}
