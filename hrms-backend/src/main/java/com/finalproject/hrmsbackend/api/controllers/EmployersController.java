package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.EmployerService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;
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
@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployersController {

    private final EmployerService employerService;

    @GetMapping("/existsByEmailAndPassword")
    public DataResult<Boolean> existsByEmailAndPassword(@RequestParam String email, @RequestParam String password){
        return employerService.existsByEmailAndPassword(email, password);
    }

    @GetMapping("/existsByCompanyName")
    public DataResult<Boolean> existsByCompanyName(@RequestParam String companyName){
        return employerService.existsByCompanyName(companyName);
    }

    @GetMapping("/existsByWebsite")
    public DataResult<Boolean> existsByWebsite(@RequestParam String website){
        return employerService.existsByWebsite(website);
    }

    @GetMapping("/getAll")
    public DataResult<List<Employer>> getAll() {
        return employerService.getAll();
    }

    @GetMapping("/getAllBySystemVerificationStatusTrue")
    public DataResult<List<Employer>> getAllBySystemVerificationStatusTrue(){
        return employerService.getAllBySystemVerificationStatusTrue();
    }

    @GetMapping("/getAllBySystemVerificationStatusFalse")
    public DataResult<List<Employer>> getAllBySystemVerificationStatusFalse(){
        return employerService.getAllBySystemVerificationStatusFalse();
    }

    @GetMapping("/getById")
    public DataResult<Employer> getById(@RequestParam int id) {
        return employerService.getById(id);
    }

    @GetMapping("/getByEmailAndPassword")
    public DataResult<Employer> getByEmailAndPassword(@RequestParam String email, @RequestParam String password){
        return employerService.getByEmailAndPassword(email, password);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody EmployerAddDto employerAddDto) {
        return ResponseEntity.ok(employerService.add(employerAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public DataResult<Boolean> deleteById(@RequestParam int id) {
        return employerService.deleteById(id);
    }

    @PutMapping(value = "/updatePassword")
    public Result updatePassword(@RequestParam String password, @RequestParam String oldPassword, @RequestParam int id) {
        return employerService.updatePassword(password, oldPassword, id);
    }

    @PutMapping(value = "/updateCompanyName")
    public Result updateCompanyName(@RequestParam String companyName, @RequestParam int id) {
        return employerService.updateCompanyName(companyName, id);
    }

    @PutMapping(value = "/updateEmailAndWebsite")
    public Result updateEmailAndWebsite(@RequestParam String email, @RequestParam String website, @RequestParam int id) {
        return employerService.updateEmailAndWebsite(email, website, id);
    }

    @PutMapping(value = "/updatePhoneNumber")
    public Result updatePhoneNumber(@RequestParam String phoneNumber, @RequestParam int id) {
        return employerService.updatePhoneNumber(phoneNumber, id);
    }

    @PutMapping(value = "/updateSystemVerificationStatus")
    public Result updateSystemVerificationStatus(@RequestParam boolean systemVerificationStatus, @RequestParam int id) {
        return employerService.updateSystemVerificationStatus(systemVerificationStatus, id);
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
