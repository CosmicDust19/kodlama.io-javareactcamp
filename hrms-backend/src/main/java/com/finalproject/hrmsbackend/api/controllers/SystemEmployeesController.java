package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.SystemEmployeeService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.SystemEmployeeAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/systemEmployees")
public class SystemEmployeesController {

    private final SystemEmployeeService systemEmployeeService;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(systemEmployeeService.getAll());
    }

    @GetMapping("/get/byId")
    public ResponseEntity<?> getById(@RequestParam int sysEmplId) {
        return Utils.getResponseEntity(systemEmployeeService.getById(sysEmplId));
    }

    @GetMapping("/get/byEmailAndPW")
    public ResponseEntity<?> getByEmailAndPW(@RequestParam String email, @RequestParam String password) {
        return Utils.getResponseEntity(systemEmployeeService.getByEmailAndPW(email, password));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody SystemEmployeeAddDto systemEmployeeAddDto) {
        return Utils.getResponseEntity(systemEmployeeService.add(systemEmployeeAddDto));
    }

    @PutMapping(value = "/update/firstName")
    public ResponseEntity<?> updateFirstName(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                             @Size(min = Utils.Const.MIN_FN, max = Utils.Const.MAX_FN, message = Msg.Annotation.SIZE) String firstName,
                                             @RequestParam int sysEmplId) {
        return Utils.getResponseEntity(systemEmployeeService.updateFirstName(firstName, sysEmplId));
    }

    @PutMapping(value = "/update/lastName")
    public ResponseEntity<?> updateLastName(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                            @Size(min = Utils.Const.MIN_LN, max = Utils.Const.MAX_LN, message = Msg.Annotation.SIZE) String lastName,
                                            @RequestParam int sysEmplId) {
        return Utils.getResponseEntity(systemEmployeeService.updateLastName(lastName, sysEmplId));
    }

}
