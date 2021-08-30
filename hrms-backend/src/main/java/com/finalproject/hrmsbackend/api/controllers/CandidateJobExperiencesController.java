package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateJobExperienceService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
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

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@Validated
@RestController
@RequestMapping("/api/candidateJobExperiences")
@RequiredArgsConstructor
public class CandidateJobExperiencesController {

    private final CandidateJobExperienceService candidateJobExperienceService;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(candidateJobExperienceService.getAll());
    }

    @GetMapping("/get/byQuitYear")
    public ResponseEntity<?> getByQuitYear(@RequestParam(required = false) Short sortDirection) {
        return Utils.getResponseEntity(candidateJobExperienceService.getByQuitYear(sortDirection));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateJobExperienceAddDto candidateJobExperienceAddDto) {
        return Utils.getResponseEntity(candidateJobExperienceService.add(candidateJobExperienceAddDto));
    }

    @DeleteMapping(value = "/delete/byId")
    public ResponseEntity<?> deleteById(@RequestParam int candJobExpId) {
        return Utils.getResponseEntity(candidateJobExperienceService.deleteById(candJobExpId));
    }

    @PutMapping(value = "/update/workPlace")
    public ResponseEntity<?> updateWorkPlace(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                             @Size(max = Utils.Const.MAX_WORKPLACE, message = Msg.Annotation.SIZE) String workPlace,
                                             @RequestParam int candJobExpId) {
        return Utils.getResponseEntity(candidateJobExperienceService.updateWorkPlace(workPlace, candJobExpId));
    }

    @PutMapping(value = "/update/position")
    public ResponseEntity<?> updatePosition(@RequestParam short positionId, @RequestParam int candJobExpId) {
        return Utils.getResponseEntity(candidateJobExperienceService.updatePosition(positionId, candJobExpId));
    }

    @PutMapping(value = "/update/startYear")
    public ResponseEntity<?> updateStartYear(@RequestParam @Min(value = Utils.Const.MIN_YEAR, message = Msg.Annotation.MIN)
                                             @Max(value = Utils.Const.THIS_YEAR, message = Msg.Annotation.MAX) short startYear,
                                             @RequestParam int candJobExpId) {
        return Utils.getResponseEntity(candidateJobExperienceService.updateStartYear(startYear, candJobExpId));
    }

    @PutMapping(value = "/update/quitYear")
    public ResponseEntity<?> updateQuitYear(@RequestParam(required = false) @Min(value = Utils.Const.MIN_YEAR, message = Msg.Annotation.MIN)
                                            @Max(value = Utils.Const.THIS_YEAR, message = Msg.Annotation.MAX) Short quitYear,
                                            @RequestParam int candJobExpId) {
        return Utils.getResponseEntity(candidateJobExperienceService.updateQuitYear(quitYear, candJobExpId));
    }

}
