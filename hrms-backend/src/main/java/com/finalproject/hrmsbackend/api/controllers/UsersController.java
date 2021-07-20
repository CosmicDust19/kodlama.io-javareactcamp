package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.core.business.UserService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@CrossOrigin
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserService userService;

    @GetMapping("/existsByEmail")
    public ResponseEntity<?> existsByEmail(@RequestParam String email) {
        return Utils.getResponseEntity(userService.existsByEmail(email));
    }

    @GetMapping("/existsByEmailAndPW")
    public ResponseEntity<?> existsByEmailAndPW(@RequestParam String email, @RequestParam String password) {
        return Utils.getResponseEntity(userService.existsByEmailAndPW(email, password));
    }

    @DeleteMapping(value = "/deleteById")
    public ResponseEntity<?> deleteById(@RequestParam int id) {
        return Utils.getResponseEntity(userService.deleteById(id));
    }

    @PutMapping(value = "/updateEmail")
    public ResponseEntity<?> updateEmail(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                         @Pattern(regexp = Utils.Const.EMAIL_REGEXP, message = MSGs.ForAnnotation.INVALID_FORMAT) String email,
                                         @RequestParam int id) {
        return Utils.getResponseEntity(userService.updateEmail(email, id));
    }

    @PutMapping(value = "/updatePW")
    public ResponseEntity<?> updatePW(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                      @Size(min = Utils.Const.MIN_PW, max = Utils.Const.MAX_PW) String pw,
                                      @RequestParam String oldPW,
                                      @RequestParam int id) {
        return Utils.getResponseEntity(userService.updatePW(pw, oldPW, id));
    }

}
