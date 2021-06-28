package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateCvService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.entities.concretes.CandidateCv;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateCvAddDto;
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
@RequestMapping("/api/cvs")
@RequiredArgsConstructor
public class CandidateCvsController {

    private final CandidateCvService candidateCvService;

    @GetMapping("/getAll")
    public DataResult<List<CandidateCv>> getAll() {
        return candidateCvService.getAll();
    }

    @GetMapping("/getById")
    public DataResult<CandidateCv> getById(@RequestParam int id) {
        return candidateCvService.getById(id);
    }

    @PostMapping(value = "/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateCvAddDto candidateCvAddDto) {
        return ResponseEntity.ok(candidateCvService.add(candidateCvAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public DataResult<Boolean> deleteById(@RequestParam int id) {
        return candidateCvService.deleteById(id);
    }

    @PutMapping(value = "/updateCoverLetter")
    public DataResult<Boolean> updateCoverLetter(@RequestParam String coverLetter, @RequestParam int id) {
        return candidateCvService.updateCoverLetter(coverLetter, id);
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
