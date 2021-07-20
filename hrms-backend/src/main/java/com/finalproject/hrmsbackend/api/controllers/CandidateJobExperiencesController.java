package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateJobExperienceService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateJobExperienceAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@CrossOrigin
@Validated
@RestController
@RequestMapping("/api/jobExperiences")
@RequiredArgsConstructor
public class CandidateJobExperiencesController {

    private final CandidateJobExperienceService candidateJobExperienceService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(candidateJobExperienceService.getAll());
    }

    @GetMapping("/getAllByQuitYear")
    public ResponseEntity<?> getAllByQuitYear(@RequestParam(required = false) Short sortDirection) {
        return Utils.getResponseEntity(candidateJobExperienceService.getAllByQuitYear(sortDirection));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateJobExperienceAddDto candidateJobExperienceAddDto) {
        return Utils.getResponseEntity(candidateJobExperienceService.add(candidateJobExperienceAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public ResponseEntity<?> deleteById(@RequestParam int id) {
        return Utils.getResponseEntity(candidateJobExperienceService.deleteById(id));
    }

    @PutMapping(value = "/updateWorkPlace")
    public ResponseEntity<?> updateWorkPlace(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                             @Size(max = Utils.Const.MAX_JOB_EXP_WORKPLACE) String workPlace,
                                             @RequestParam int id) {
        return Utils.getResponseEntity(candidateJobExperienceService.updateWorkPlace(workPlace, id));
    }

    @PutMapping(value = "/updatePosition")
    public ResponseEntity<?> updatePosition(@RequestParam short positionId, @RequestParam int id) {
        return Utils.getResponseEntity(candidateJobExperienceService.updatePosition(positionId, id));
    }

    @PutMapping(value = "/updateStartYear")
    public ResponseEntity<?> updateStartYear(@RequestParam @Min(value = Utils.Const.MIN_YEAR)
                                             @Max(value = Utils.Const.THIS_YEAR) short startYear,
                                             @RequestParam int id) {
        return Utils.getResponseEntity(candidateJobExperienceService.updateStartYear(startYear, id));
    }

    @PutMapping(value = "/updateQuitYear")
    public ResponseEntity<?> updateQuitYear(@RequestParam(required = false) @Min(value = Utils.Const.MIN_YEAR)
                                            @Max(value = Utils.Const.THIS_YEAR) Short quitYear,
                                            @RequestParam int id) {
        return Utils.getResponseEntity(candidateJobExperienceService.updateQuitYear(quitYear, id));
    }

}
