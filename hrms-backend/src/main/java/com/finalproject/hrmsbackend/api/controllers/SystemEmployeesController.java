package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.SystemEmployeeService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.SystemEmployeesAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@CrossOrigin
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/systemEmployees")
public class SystemEmployeesController {

    private final SystemEmployeeService systemEmployeeService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(systemEmployeeService.getAll());
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam int id) {
        return Utils.getResponseEntity(systemEmployeeService.getById(id));
    }

    @GetMapping("/getByEmailAndPW")
    public ResponseEntity<?> getByEmailAndPW(@RequestParam String email, @RequestParam String password) {
        return Utils.getResponseEntity(systemEmployeeService.getByEmailAndPW(email, password));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody SystemEmployeesAddDto systemEmployeesAddDto) {
        return Utils.getResponseEntity(systemEmployeeService.add(systemEmployeesAddDto));
    }

    @PutMapping(value = "/updateFirstName")
    public ResponseEntity<?> updateFirstName(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                             @Size(min = Utils.Const.MIN_FN, max = Utils.Const.MAX_FN) String firstName,
                                             @RequestParam int id) {
        return Utils.getResponseEntity(systemEmployeeService.updateFirstName(firstName, id));
    }

    @PutMapping(value = "/updateLastName")
    public ResponseEntity<?> updateLastName(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                            @Size(min = Utils.Const.MIN_LN, max = Utils.Const.MAX_LN) String lastName,
                                            @RequestParam int id) {
        return Utils.getResponseEntity(systemEmployeeService.updateLastName(lastName, id));
    }

}
