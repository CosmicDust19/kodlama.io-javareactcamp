package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateCvService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
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

    @PutMapping(value = "/updateTitle")
    public Result updateTitle(@RequestParam String title, @RequestParam int id) {
        return candidateCvService.updateTitle(title, id);
    }

    @PutMapping(value = "/updateCoverLetter")
    public Result updateCoverLetter(String coverLetter, @RequestParam int id) {
        return candidateCvService.updateCoverLetter(coverLetter, id);
    }

    @PutMapping(value = "/syncJobExperiencesInCandidateCv")
    public Result syncJobExperiencesInCandidateCv(@RequestParam List<Integer> candidateJobExperienceIds, @RequestParam int candidateCvId) {
        return candidateCvService.syncCandidateCvJobExperiences(candidateJobExperienceIds, candidateCvId);
    }

    @PutMapping(value = "/syncLanguagesInCandidateCv")
    public Result syncLanguagesInCandidateCv(@RequestParam List<Integer> candidateLanguageIds, @RequestParam int candidateCvId) {
        return candidateCvService.syncCandidateCvLanguages(candidateLanguageIds, candidateCvId);
    }

    @PutMapping(value = "/syncSchoolsInCandidateCv")
    public Result syncSchoolsInCandidateCv(@RequestParam List<Integer> candidateSchoolIds, @RequestParam int candidateCvId) {
        return candidateCvService.syncCandidateCvSchools(candidateSchoolIds, candidateCvId);
    }

    @PutMapping(value = "/syncSkillsInCandidateCv")
    public Result syncSkillsInCandidateCv(@RequestParam List<Integer> candidateSkillIds, @RequestParam int candidateCvId) {
        return candidateCvService.syncCandidateCvSkills(candidateSkillIds, candidateCvId);
    }

    @PutMapping(value = "/addToCandidateCv/JobExperiences")
    public Result addJobExperiencesToCandidateCv(@RequestParam List<Integer> candidateJobExperienceIds, @RequestParam int candidateCvId) {
        return candidateCvService.addJobExperiencesToCandidateCv(candidateJobExperienceIds, candidateCvId, (byte)0);
    }

    @PutMapping(value = "/addToCandidateCv/Languages")
    public Result addLanguagesToCandidateCv(@RequestParam List<Integer> candidateLanguageIds, @RequestParam int candidateCvId) {
        return candidateCvService.addLanguagesToCandidateCv(candidateLanguageIds, candidateCvId, (byte) 0);
    }

    @PutMapping(value = "/addToCandidateCv/Schools")
    public Result addSchoolsToCandidateCv(@RequestParam List<Integer> candidateSchoolIds, @RequestParam int candidateCvId) {
        return candidateCvService.addSchoolsToCandidateCv(candidateSchoolIds, candidateCvId, (byte) 0);
    }

    @PutMapping(value = "/addToCandidateCv/Skills")
    public Result addSkillsToCandidateCv(@RequestParam List<Integer> candidateSkillIds, @RequestParam int candidateCvId) {
        return candidateCvService.addSkillsToCandidateCv(candidateSkillIds, candidateCvId, (byte) 0);
    }

    @PutMapping(value = "/deleteFromCandidateCv/JobExperiences")
    public Result deleteJobExperiencesFromCandidateCv(@RequestParam List<Integer> candidateJobExperienceIds, @RequestParam int candidateCvId) {
        return candidateCvService.deleteJobExperiencesFromCandidateCv(candidateJobExperienceIds, candidateCvId, (byte) 0);
    }

    @PutMapping(value = "/deleteFromCandidateCv/Languages")
    public Result deleteLanguageFromCandidateCv(@RequestParam List<Integer> candidateLanguageIds, @RequestParam int candidateCvId) {
        return candidateCvService.deleteLanguagesFromCandidateCv(candidateLanguageIds, candidateCvId, (byte) 0);
    }

    @PutMapping(value = "/deleteFromCandidateCv/Schools")
    public Result deleteSchoolFromCandidateCv(@RequestParam List<Integer> candidateSchoolIds, @RequestParam int candidateCvId) {
        return candidateCvService.deleteSchoolsFromCandidateCv(candidateSchoolIds, candidateCvId, (byte) 0);
    }

    @PutMapping(value = "/deleteFromCandidateCv/Skills")
    public Result deleteSkillFromCandidateCv(@RequestParam List<Integer> candidateSkillIds, @RequestParam int candidateCvId) {
        return candidateCvService.deleteSkillsFromCandidateCv(candidateSkillIds, candidateCvId, (byte) 0);
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
