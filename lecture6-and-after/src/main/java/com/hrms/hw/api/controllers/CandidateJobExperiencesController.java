package com.hrms.hw.api.controllers;

import com.hrms.hw.business.abstracts.CandidateJobExperienceService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.ErrorDataResult;
import com.hrms.hw.entities.concretes.CandidateJobExperience;
import com.hrms.hw.entities.concretes.dtos.CandidateJobExperienceAddDto;
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
@RequestMapping("/api/jobExperiences")
@RequiredArgsConstructor
public class CandidateJobExperiencesController {

    private final CandidateJobExperienceService candidateJobExperienceService;

    @GetMapping("/getAll")
    public DataResult<List<CandidateJobExperience>> getAll() {
        return candidateJobExperienceService.getAll();
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateJobExperienceAddDto candidateJobExperienceAddDto) {
        return ResponseEntity.ok(candidateJobExperienceService.add(candidateJobExperienceAddDto));
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
