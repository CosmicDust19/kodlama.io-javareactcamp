package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.JobAdvertisementService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementDto;
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
    public ResponseEntity<?> getAll(@RequestParam(required = false) Short sortDirection,
                                    @RequestParam(required = false) String propName) {
        return Utils.getResponseEntity(jobAdvService.getAll(sortDirection, propName));
    }

    @GetMapping("/get/byEmployer")
    public ResponseEntity<?> getAllByEmployer(@RequestParam Integer employerId) {
        return Utils.getResponseEntity(jobAdvService.getAllByEmployer(employerId));
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
    public ResponseEntity<?> getPublicByEmployer(@RequestParam int employerId,
                                                 @RequestParam(required = false) Short sortDirection,
                                                 @RequestParam(required = false) String propName) {
        return Utils.getResponseEntity(jobAdvService.getPublicByEmployer(employerId, sortDirection, propName));
    }

    @GetMapping("/get/unverified")
    public ResponseEntity<?> getUnverified(@RequestParam(required = false) Short sortDirection) {
        return Utils.getResponseEntity(jobAdvService.getUnverified(sortDirection));
    }

    @GetMapping("/get/public")
    public ResponseEntity<?> getPublic(@RequestParam(required = false) Short sortDirection,
                                       @RequestParam(required = false) String propName) {
        return Utils.getResponseEntity(jobAdvService.getPublic(sortDirection, propName));
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
    public ResponseEntity<?> add(@RequestBody @Valid JobAdvertisementDto jobAdvertisementDto) {
        return Utils.getResponseEntity(jobAdvService.add(jobAdvertisementDto));
    }

    @DeleteMapping(value = "/delete/byId")
    public ResponseEntity<?> deleteById(@RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.deleteById(jobAdvId));
    }

    @PutMapping(value = "/update")
    public ResponseEntity<?> update(@RequestBody @Valid JobAdvertisementDto jobAdvertisementDto) {
        return Utils.getResponseEntity(jobAdvService.update(jobAdvertisementDto));
    }

    @PutMapping(value = "/update/position")
    public ResponseEntity<?> updatePosition(@RequestParam short positionId, @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updatePosition(positionId, jobAdvId));
    }

    @PutMapping("/update/jobDesc")
    public ResponseEntity<?> updateJobDesc(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED) String jobDescription,
                                           @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateJobDesc(jobDescription, jobAdvId));
    }

    @PutMapping("/update/city")
    public ResponseEntity<?> updateCity(@RequestParam short cityId, @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateCity(cityId, jobAdvId));
    }

    @PutMapping("/update/minSalary")
    public ResponseEntity<?> updateMinSalary(@RequestParam(required = false) @Positive(message = Msg.Annotation.POSITIVE) Double minSalary,
                                             @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateMinSalary(minSalary, jobAdvId));
    }

    @PutMapping("/update/maxSalary")
    public ResponseEntity<?> updateMaxSalary(@RequestParam(required = false) @Positive(message = Msg.Annotation.POSITIVE) Double maxSalary,
                                             @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateMaxSalary(maxSalary, jobAdvId));
    }

    @PutMapping("/update/workModel")
    public ResponseEntity<?> updateWorkModel(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                             @Size(max = Utils.Const.MAX_JOB_ADV_WORK_MODEL, message = Msg.Annotation.SIZE) String workModel,
                                             @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateWorkModel(workModel, jobAdvId));
    }

    @PutMapping("/update/workTime")
    public ResponseEntity<?> updateWorkTime(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                            @Size(max = Utils.Const.MAX_JOB_ADV_WORK_TIME, message = Msg.Annotation.SIZE) String workTime,
                                            @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateWorkTime(workTime, jobAdvId));
    }

    @PutMapping(value = "/update/deadLine")
    public ResponseEntity<?> updateDeadLine(@RequestParam(required = false) @Future(message = Msg.Annotation.FUTURE) LocalDate deadLine,
                                            @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateDeadLine(deadLine, jobAdvId));
    }

    @PutMapping(value = "/update/openPositions")
    public ResponseEntity<?> updateOpenPositions(@RequestParam @Positive(message = Msg.Annotation.POSITIVE) short openPositions,
                                                 @RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.updateOpenPositions(openPositions, jobAdvId));
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
