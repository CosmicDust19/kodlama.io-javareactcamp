package com.hrms.lecture6hw2.api.controllers;


import com.hrms.lecture6hw2.business.abstracts.UserService;
import com.hrms.lecture6hw2.entities.concretes.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getall")
    public List<User> getAll(){
        return userService.getAll();
    }
}
