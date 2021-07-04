package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateJobExperienceService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateJobExperienceAddDto;
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
@RequestMapping("/api/jobExperiences")
@RequiredArgsConstructor
public class CandidateJobExperiencesController {

    private final CandidateJobExperienceService candidateJobExperienceService;

    @GetMapping("/getAll")
    public DataResult<List<CandidateJobExperience>> getAll() {
        return candidateJobExperienceService.getAll();
    }

    @GetMapping("/getAllSortedDesc")
    public DataResult<List<CandidateJobExperience>> getAllSortedDesc() {
        return candidateJobExperienceService.getAllSortedDesc();
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateJobExperienceAddDto candidateJobExperienceAddDto) {
        return ResponseEntity.ok(candidateJobExperienceService.add(candidateJobExperienceAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public DataResult<Boolean> deleteById(@RequestParam int id) {
        return candidateJobExperienceService.deleteById(id);
    }

    @PutMapping(value = "/updateWorkPlace")
    public Result updateWorkPlace(@RequestParam String workPlace, @RequestParam int id) {
        return candidateJobExperienceService.updateWorkPlace(workPlace, id);
    }

    @PutMapping(value = "/updatePosition")
    public Result updatePosition(@RequestParam short positionId, @RequestParam int id) {
        return candidateJobExperienceService.updatePosition(positionId, id);
    }

    @PutMapping(value = "/updateStartYear")
    public Result updateStartYear(@RequestParam short startYear, @RequestParam int id) {
        return candidateJobExperienceService.updateStartYear(startYear, id);
    }

    @PutMapping(value = "/updateQuitYear")
    public Result updateQuitYear(Short quitYear, @RequestParam int id) {
        return candidateJobExperienceService.updateQuitYear(quitYear, id);
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
