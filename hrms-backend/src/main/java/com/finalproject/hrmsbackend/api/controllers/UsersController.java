package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.core.business.UserManager;
import com.finalproject.hrmsbackend.core.business.UserService;
import com.finalproject.hrmsbackend.core.entities.User;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserService<User> userService;

    @GetMapping("/getAll")
    public DataResult<List<User>> getAll(){
        return userService.getAll();
    }

    @GetMapping("/existsByEmail")
    public DataResult<Boolean> existsByEmail(@RequestParam String email){
        return userService.existsByEmail(email);
    }
}
