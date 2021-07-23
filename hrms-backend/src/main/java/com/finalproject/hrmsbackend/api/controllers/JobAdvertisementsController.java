package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.JobAdvertisementService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/jobAdvertisements")
public class JobAdvertisementsController {

    private final JobAdvertisementService jobAdvService;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(jobAdvService.getAll());
    }

    @GetMapping("/get/active")
    public ResponseEntity<?> getActiveVerified() {
        return Utils.getResponseEntity(jobAdvService.getActiveVerified());
    }

    @GetMapping("/get/activeVerifiedByCreatedAt")
    public ResponseEntity<?> getActiveVerifiedByCreatedAt(@RequestParam(required = false) Short sortDirection) {
        return Utils.getResponseEntity(jobAdvService.getActiveVerifiedByCreatedAt(sortDirection));
    }

    @GetMapping("/get/publicByEmployer")
    public ResponseEntity<?> getPublicByEmployer(@RequestParam int employerId) {
        return Utils.getResponseEntity(jobAdvService.getPublicByEmployer(employerId));
    }

    @GetMapping("/get/unverified")
    public ResponseEntity<?> getUnverified(@RequestParam(required = false) Short sortDirection) {
        return Utils.getResponseEntity(jobAdvService.getUnverified(sortDirection));
    }

    @GetMapping("/get/public")
    public ResponseEntity<?> getPublic(@RequestParam(required = false) Short sortDirection) {
        return Utils.getResponseEntity(jobAdvService.getPublic(sortDirection));
    }

    @GetMapping("/get/activeVerifiedPast")
    public ResponseEntity<?> getActiveVerifiedPast() {
        return Utils.getResponseEntity(jobAdvService.getActiveVerifiedPast());
    }

    @GetMapping("/get/byId")
    public ResponseEntity<?> getById(@RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.getById(jobAdvId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody @Valid JobAdvertisementAddDto jobAdvertisementAddDto) {
        return Utils.getResponseEntity(jobAdvService.add(jobAdvertisementAddDto));
    }

    @DeleteMapping(value = "/delete/byId")
    public ResponseEntity<?> deleteById(@RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.deleteById(jobAdvId));
    }

    @PutMapping(value = "/update/position")
    public ResponseEntity<?> updatePosition(@RequestParam short positionId, @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updatePosition(positionId, jobAdvId));
    }

    @PutMapping("/update/jobDesc")
    public ResponseEntity<?> updateJobDesc(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY) String jobDescription,
                                           @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateJobDesc(jobDescription, jobAdvId));
    }

    @PutMapping("/update/city")
    public ResponseEntity<?> updateCity(@RequestParam short cityId, @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateCity(cityId, jobAdvId));
    }

    @PutMapping("/update/minSalary")
    public ResponseEntity<?> updateMinSalary(@RequestParam(required = false) @Positive(message = MSGs.ForAnnotation.NOT_POSITIVE) Double minSalary,
                                             @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateMinSalary(minSalary, jobAdvId));
    }

    @PutMapping("/update/maxSalary")
    public ResponseEntity<?> updateMaxSalary(@RequestParam(required = false) @Positive(message = MSGs.ForAnnotation.NOT_POSITIVE) Double maxSalary,
                                             @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateMaxSalary(maxSalary, jobAdvId));
    }

    @PutMapping("/update/workModel")
    public ResponseEntity<?> updateWorkModel(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                             @Size(max = Utils.Const.MAX_JOB_ADV_WORK_MODEL) String workModel,
                                             @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateWorkModel(workModel, jobAdvId));
    }

    @PutMapping("/update/workTime")
    public ResponseEntity<?> updateWorkTime(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                            @Size(max = Utils.Const.MAX_JOB_ADV_WORK_TIME) String workTime,
                                            @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateWorkTime(workTime, jobAdvId));
    }

    @PutMapping(value = "/update/deadLine")
    public ResponseEntity<?> updateDeadLine(@RequestParam(required = false) @Future(message = MSGs.ForAnnotation.PAST_OR_PRESENT) LocalDate deadLine,
                                            @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateDeadLine(deadLine, jobAdvId));
    }

    @PutMapping(value = "/update/openPositions")
    public ResponseEntity<?> updateOpenPositions(@RequestParam @Positive(message = MSGs.ForAnnotation.NOT_POSITIVE) short number,
                                                 @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateOpenPositions(number, jobAdvId));
    }

    @PutMapping(value = "/update/applyChanges")
    public ResponseEntity<?> applyChanges(@RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.applyChanges(jobAdvId));
    }

    @PutMapping("/update/activation")
    public ResponseEntity<?> updateActivation(@RequestParam boolean status, @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateActivation(status, jobAdvId));
    }

    @PutMapping("/update/verification")
    public ResponseEntity<?> updateVerification(@RequestParam boolean status, @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateVerification(status, jobAdvId));
    }

}
