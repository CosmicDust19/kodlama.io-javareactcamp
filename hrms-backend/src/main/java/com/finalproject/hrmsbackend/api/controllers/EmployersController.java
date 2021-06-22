package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.EmployerService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
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

    @GetMapping("/getAll")
    public DataResult<List<Employer>> getAll() {
        return employerService.getAll();
    }

    @GetMapping("/getById")
    public DataResult<Employer> getById(@RequestParam int id) {
        return employerService.getById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody EmployerAddDto employerAddDto) {
        return ResponseEntity.ok(employerService.add(employerAddDto));
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
