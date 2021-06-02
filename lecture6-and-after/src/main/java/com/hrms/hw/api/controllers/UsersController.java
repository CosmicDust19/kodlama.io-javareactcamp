package com.hrms.hw.api.controllers;

import com.hrms.hw.business.abstracts.UserService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserService<User> userService;

    @GetMapping("/getAll")
    public DataResult<List<User>> getAll(){
        return userService.getAll();
    }

}
