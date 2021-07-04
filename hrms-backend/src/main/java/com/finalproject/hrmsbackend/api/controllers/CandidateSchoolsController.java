package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSchoolService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSchool;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSchoolAddDto;
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
@RequestMapping("/api/candidateSchools")
@RequiredArgsConstructor
public class CandidateSchoolsController {

    private final CandidateSchoolService candidateSchoolService;

    @GetMapping("/getAll")
    public DataResult<List<CandidateSchool>> getAll() {
        return candidateSchoolService.getAll();
    }

    @GetMapping("/getAllSortedDesc")
    public DataResult<List<CandidateSchool>> getAllSortedDesc() {
        return candidateSchoolService.getAllSortedDesc();
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateSchoolAddDto candidateSchoolAddDto) {
        return ResponseEntity.ok(candidateSchoolService.add(candidateSchoolAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public DataResult<Boolean> deleteById(@RequestParam int id) {
        return candidateSchoolService.deleteById(id);
    }

    @PutMapping(value = "/updateSchool")
    public Result updateSchool(@RequestParam int schoolId, @RequestParam int id) {
        return candidateSchoolService.updateSchool(schoolId, id);
    }

    @PutMapping(value = "/updateDepartment")
    public Result updateDepartment(@RequestParam short departmentId, @RequestParam int id) {
        return candidateSchoolService.updateDepartment(departmentId, id);
    }

    @PutMapping(value = "/updateStartYear")
    public Result updateStartYear(@RequestParam short startYear, @RequestParam int id) {
        return candidateSchoolService.updateStartYear(startYear, id);
    }

    @PutMapping(value = "/updateGraduationYear")
    public Result updateGraduationYear(Short graduationYear, @RequestParam int id) {
        return candidateSchoolService.updateGraduationYear(graduationYear, id);
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
