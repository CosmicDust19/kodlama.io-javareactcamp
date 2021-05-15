package com.hrms.lecture6hw2.business.abstracts;

import com.hrms.lecture6hw2.entities.concretes.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    List<User> getAll();
}
