package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.core.business.abstracts.UserService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserService userService;

    @GetMapping("/exists/byEmail")
    public ResponseEntity<?> existsByEmail(@RequestParam String email) {
        return Utils.getResponseEntity(userService.existsByEmail(email));
    }

    @GetMapping("/exists/byEmailAndPW")
    public ResponseEntity<?> existsByEmailAndPW(@RequestParam String email, @RequestParam String password) {
        return Utils.getResponseEntity(userService.existsByEmailAndPW(email, password));
    }

    @DeleteMapping(value = "/delete/byId")
    public ResponseEntity<?> deleteById(@RequestParam int userId) {
        return Utils.getResponseEntity(userService.deleteById(userId));
    }

    @GetMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        return Utils.getResponseEntity(userService.login(email, password));
    }

    @PutMapping(value = "/update/email")
    public ResponseEntity<?> updateEmail(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                         @Pattern(regexp = Utils.Const.EMAIL_REGEXP, message = Msg.Annotation.PATTERN) String email,
                                         @RequestParam int userId) {
        return Utils.getResponseEntity(userService.updateEmail(email, userId));
    }

    @PutMapping(value = "/update/pw")
    public ResponseEntity<?> updatePW(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                      @Size(min = Utils.Const.MIN_PW, max = Utils.Const.MAX_PW, message = Msg.Annotation.SIZE) String password,
                                      @RequestParam String oldPassword,
                                      @RequestParam int userId) {
        return Utils.getResponseEntity(userService.updatePW(password, oldPassword, userId));
    }

    @PutMapping(value = "/update/profileImg")
    public ResponseEntity<?> updateProfileImg(@RequestParam(required = false) Integer imgId, @RequestParam int userId) {
        return Utils.getResponseEntity(userService.updateProfileImg(imgId, userId));
    }

}
