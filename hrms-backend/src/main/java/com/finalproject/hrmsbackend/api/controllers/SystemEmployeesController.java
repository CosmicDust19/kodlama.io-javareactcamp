package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.SystemEmployeeService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.SystemEmployee;
import com.finalproject.hrmsbackend.entities.concretes.dtos.SystemEmployeesAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/systemEmployees")
public class SystemEmployeesController {

    private final SystemEmployeeService systemEmployeeService;

    @GetMapping("/existsByEmailAndPassword")
    public DataResult<Boolean> existsByEmailAndPassword(@RequestParam String email, @RequestParam String password){
        return systemEmployeeService.existsByEmailAndPassword(email, password);
    }

    @GetMapping("/getAll")
    public DataResult<List<SystemEmployee>> getAll() {
        return systemEmployeeService.getAll();
    }

    @GetMapping("/getById")
    public DataResult<SystemEmployee> getById(@RequestParam int id) {
        return systemEmployeeService.getById(id);
    }

    @GetMapping("/getByEmailAndPassword")
    public DataResult<SystemEmployee> getByEmailAndPassword(@RequestParam String email, @RequestParam String password){
        return systemEmployeeService.getByEmailAndPassword(email, password);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody SystemEmployeesAddDto systemEmployeesAddDto) {
        return ResponseEntity.ok(systemEmployeeService.add(systemEmployeesAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public DataResult<Boolean> deleteById(@RequestParam int id) {
        return systemEmployeeService.deleteById(id);
    }

    @PutMapping(value = "/updateEmail")
    public Result updateEmail(@RequestParam String email, @RequestParam int id) {
        return systemEmployeeService.updateEmail(email, id);
    }

    @PutMapping(value = "/updatePassword")
    public Result updatePassword(@RequestParam String password, @RequestParam String oldPassword, @RequestParam int id) {
        return systemEmployeeService.updatePassword(password, oldPassword, id);
    }

    @PutMapping(value = "/updateFirstName")
    public Result updateFirstName(@RequestParam String firstName, @RequestParam int id) {
        return systemEmployeeService.updateFirstName(firstName, id);
    }

    @PutMapping(value = "/updateLastName")
    public Result updateLastName(@RequestParam String lastName, @RequestParam int id) {
        return systemEmployeeService.updateLastName(lastName, id);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorDataResult<Object> handleValidationExceptions(MethodArgumentNotValidException exceptions) {
        Map<String, String> validationErrors = new HashMap<>();
        for (FieldError fieldError : exceptions.getBindingResult().getFieldErrors()) {
            validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return new ErrorDataResult<>("Error", validationErrors);
    }
}
