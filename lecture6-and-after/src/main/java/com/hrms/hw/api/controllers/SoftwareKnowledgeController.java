package com.hrms.hw.api.controllers;

import com.hrms.hw.business.abstracts.SoftwareKnowledgeService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.ErrorDataResult;
import com.hrms.hw.entities.concretes.SoftwareKnowledge;
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

@RestController
@RequestMapping("/api/softwareKnowledge")
@RequiredArgsConstructor
public class SoftwareKnowledgeController {

    private final SoftwareKnowledgeService softwareKnowledgeService;

    @GetMapping("/getAll")
    public DataResult<List<SoftwareKnowledge>> getAll() {
        return softwareKnowledgeService.getAll();
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody SoftwareKnowledge softwareKnowledge) {
        return ResponseEntity.ok(softwareKnowledgeService.add(softwareKnowledge));
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
