package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSchoolService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSchoolAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@CrossOrigin
@Validated
@RestController
@RequestMapping("/api/candidateSchools")
@RequiredArgsConstructor
public class CandidateSchoolsController {

    private final CandidateSchoolService candidateSchoolService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(candidateSchoolService.getAll());
    }

    @GetMapping("/getAllByGradYear")
    public ResponseEntity<?> getAllByGradYear(Short sortDirection) {
        return Utils.getResponseEntity(candidateSchoolService.getAllByGradYear(sortDirection));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateSchoolAddDto candidateSchoolAddDto) {
        return Utils.getResponseEntity(candidateSchoolService.add(candidateSchoolAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public ResponseEntity<?> deleteById(@RequestParam int id) {
        return Utils.getResponseEntity(candidateSchoolService.deleteById(id));
    }

    @PutMapping(value = "/updateSchool")
    public ResponseEntity<?> updateSchool(@RequestParam int schoolId, @RequestParam int id) {
        return Utils.getResponseEntity(candidateSchoolService.updateSchool(schoolId, id));
    }

    @PutMapping(value = "/updateDepartment")
    public ResponseEntity<?> updateDepartment(@RequestParam short departmentId, @RequestParam int id) {
        return Utils.getResponseEntity(candidateSchoolService.updateDepartment(departmentId, id));
    }

    @PutMapping(value = "/updateStartYear")
    public ResponseEntity<?> updateStartYear(@RequestParam @Min(value = Utils.Const.MIN_YEAR)
                                             @Max(value = Utils.Const.THIS_YEAR) short startYear,
                                             @RequestParam int id) {
        return Utils.getResponseEntity(candidateSchoolService.updateStartYear(startYear, id));
    }

    @PutMapping(value = "/updateGradYear")
    public ResponseEntity<?> updateGradYear(@RequestParam(required = false) @Min(value = Utils.Const.MIN_YEAR)
                                            @Max(value = Utils.Const.THIS_YEAR) Short graduationYear,
                                            @RequestParam int id) {
        return Utils.getResponseEntity(candidateSchoolService.updateGradYear(graduationYear, id));
    }

}
