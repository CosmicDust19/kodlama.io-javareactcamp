package com.hrms.hw.api.controllers;

import com.hrms.hw.business.abstracts.CandidateSoftwareKnowledgeService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.ErrorDataResult;
import com.hrms.hw.entities.concretes.CandidateSoftwareKnowledge;
import com.hrms.hw.entities.concretes.dtos.CandidateSoftwareKnowledgeAddDto;
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
@RequestMapping("/api/cvsSoftwareKnowledge")
@RequiredArgsConstructor
public class CandidateSoftwareKnowledgeController {

    private final CandidateSoftwareKnowledgeService candidateSoftwareKnowledgeService;

    @GetMapping("/getAll")
    public DataResult<List<CandidateSoftwareKnowledge>> getAll() {
        return candidateSoftwareKnowledgeService.getAll();
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateSoftwareKnowledgeAddDto candidateSoftwareKnowledgeAddDto) {
        return ResponseEntity.ok(candidateSoftwareKnowledgeService.add(candidateSoftwareKnowledgeAddDto));
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
