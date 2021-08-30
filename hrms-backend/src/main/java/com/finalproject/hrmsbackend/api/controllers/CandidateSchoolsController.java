package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSchoolService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSchoolAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@Validated
@RestController
@RequestMapping("/api/candidateSchools")
@RequiredArgsConstructor
public class CandidateSchoolsController {

    private final CandidateSchoolService candidateSchoolService;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(candidateSchoolService.getAll());
    }

    @GetMapping("/get/byGradYear")
    public ResponseEntity<?> getByGradYear(@RequestParam(required = false) Short sortDirection) {
        return Utils.getResponseEntity(candidateSchoolService.getByGradYear(sortDirection));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateSchoolAddDto candidateSchoolAddDto) {
        return Utils.getResponseEntity(candidateSchoolService.add(candidateSchoolAddDto));
    }

    @DeleteMapping(value = "/delete/byId")
    public ResponseEntity<?> deleteById(@RequestParam int candSchId) {
        return Utils.getResponseEntity(candidateSchoolService.deleteById(candSchId));
    }

    @PutMapping(value = "/update/school")
    public ResponseEntity<?> updateSchool(@RequestParam int schoolId, @RequestParam int candSchId) {
        return Utils.getResponseEntity(candidateSchoolService.updateSchool(schoolId, candSchId));
    }

    @PutMapping(value = "/update/department")
    public ResponseEntity<?> updateDepartment(@RequestParam short departmentId, @RequestParam int candSchId) {
        return Utils.getResponseEntity(candidateSchoolService.updateDepartment(departmentId, candSchId));
    }

    @PutMapping(value = "/update/startYear")
    public ResponseEntity<?> updateStartYear(@RequestParam @Min(value = Utils.Const.MIN_YEAR, message = Msg.Annotation.MIN)
                                             @Max(value = Utils.Const.THIS_YEAR, message = Msg.Annotation.MAX) short startYear,
                                             @RequestParam int candSchId) {
        return Utils.getResponseEntity(candidateSchoolService.updateStartYear(startYear, candSchId));
    }

    @PutMapping(value = "/update/gradYear")
    public ResponseEntity<?> updateGradYear(@RequestParam(required = false) @Min(value = Utils.Const.MIN_YEAR, message = Msg.Annotation.MIN)
                                            @Max(value = Utils.Const.THIS_YEAR, message = Msg.Annotation.MAX) Short graduationYear,
                                            @RequestParam int candSchId) {
        return Utils.getResponseEntity(candidateSchoolService.updateGradYear(graduationYear, candSchId));
    }

}
