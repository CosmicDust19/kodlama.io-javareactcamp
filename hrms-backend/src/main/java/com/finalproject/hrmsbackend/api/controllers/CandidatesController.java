package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;
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
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidatesController {

    private final CandidateService candidateService;

    @GetMapping("/existsByEmailAndPassword")
    public DataResult<Boolean> existsByEmailAndPassword(@RequestParam String email, @RequestParam String password){
        return candidateService.existsByEmailAndPassword(email, password);
    }

    @GetMapping("/existsByNationalityId")
    public DataResult<Boolean> existsByNationalityId(@RequestParam String nationalityId){
        return candidateService.existsByNationalityId(nationalityId);
    }

    @GetMapping("/getAll")
    public DataResult<List<Candidate>> getAll() {
        return candidateService.getAll();
    }

    @GetMapping("/getById")
    public DataResult<Candidate> getById(@RequestParam int id) {
        return candidateService.getById(id);
    }

    @GetMapping("/getByEmailAndPassword")
    public DataResult<Candidate> getByEmailAndPassword(@RequestParam String email, @RequestParam String password){
        return candidateService.getByEmailAndPassword(email, password);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateAddDto candidateAddDto) {
        return ResponseEntity.ok(candidateService.add(candidateAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public DataResult<Boolean> deleteById(@RequestParam int id) {
        return candidateService.deleteById(id);
    }

    @PutMapping(value = "/updateEmail")
    public Result updateEmail(@RequestParam String email, @RequestParam int id) {
        return candidateService.updateEmail(email, id);
    }

    @PutMapping(value = "/updatePassword")
    public Result updatePassword(@RequestParam String password, @RequestParam String oldPassword, @RequestParam int id) {
        return candidateService.updatePassword(password, oldPassword, id);
    }

    @PutMapping(value = "/updateGithubAccountLink")
    public Result updateGithubAccountLink(String githubAccountLink, @RequestParam int id) {
        return candidateService.updateGithubAccountLink(githubAccountLink, id);
    }

    @PutMapping(value = "/updateLinkedinAccountLink")
    public Result updateLinkedinAccountLink(String linkedinAccountLink, @RequestParam int id) {
        return candidateService.updateLinkedinAccountLink(linkedinAccountLink, id);
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
