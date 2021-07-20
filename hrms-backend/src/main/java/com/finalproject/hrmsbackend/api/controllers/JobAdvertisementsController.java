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

@CrossOrigin
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/jobAdvertisements")
public class JobAdvertisementsController {

    private final JobAdvertisementService jobAdvService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(jobAdvService.getAll());
    }

    @GetMapping("/getAllActives")
    public ResponseEntity<?> getAllActiveVerified() {
        return Utils.getResponseEntity(jobAdvService.getAllActiveVerified());
    }

    @GetMapping("/getAllActiveVerifiedByCreatedAt")
    public ResponseEntity<?> getAllActiveVerifiedByCreatedAt(@RequestParam(required = false) Short sortDirection) {
        return Utils.getResponseEntity(jobAdvService.getAllActiveVerifiedByDate(sortDirection));
    }

    @GetMapping("/getAllPublicByEmployer")
    public ResponseEntity<?> getAllPublicByEmployer(@RequestParam int employerId) {
        return Utils.getResponseEntity(jobAdvService.getAllPublicByEmployer(employerId));
    }

    @GetMapping("/getAllNotVerified")
    public ResponseEntity<?> getAllNotVerified(@RequestParam(required = false) Short sortDirection) {
        return Utils.getResponseEntity(jobAdvService.getAllUnverified(sortDirection));
    }

    @GetMapping("/getAllPublic")
    public ResponseEntity<?> getAllPublic(@RequestParam(required = false) Short sortDirection) {
        return Utils.getResponseEntity(jobAdvService.getAllPublic(sortDirection));
    }

    @GetMapping("/getAllActiveVerifiedPast")
    public ResponseEntity<?> getAllActiveVerifiedPast() {
        return Utils.getResponseEntity(jobAdvService.getAllActiveVerifiedPast());
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.getById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody @Valid JobAdvertisementAddDto jobAdvertisementAddDto) {
        return Utils.getResponseEntity(jobAdvService.add(jobAdvertisementAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public ResponseEntity<?> deleteById(@RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.deleteById(id));
    }

    @PutMapping(value = "/updatePosition")
    public ResponseEntity<?> updatePosition(@RequestParam short positionId, @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updatePosition(positionId, id));
    }

    @PutMapping("/updateJobDesc")
    public ResponseEntity<?> updateJobDesc(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY) String jobDescription,
                                           @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updateJobDesc(jobDescription, id));
    }

    @PutMapping("/updateCity")
    public ResponseEntity<?> updateCity(@RequestParam short cityId, @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updateCity(cityId, id));
    }

    @PutMapping("/updateMinSalary")
    public ResponseEntity<?> updateMinSalary(@RequestParam(required = false) @Positive(message = MSGs.ForAnnotation.NOT_POSITIVE) Double minSalary,
                                             @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updateMinSalary(minSalary, id));
    }

    @PutMapping("/updateMaxSalary")
    public ResponseEntity<?> updateMaxSalary(@RequestParam(required = false) @Positive(message = MSGs.ForAnnotation.NOT_POSITIVE) Double maxSalary,
                                             @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updateMaxSalary(maxSalary, id));
    }

    @PutMapping("/updateWorkModel")
    public ResponseEntity<?> updateWorkModel(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                             @Size(max = Utils.Const.MAX_JOB_ADV_WORK_MODEL) String workModel,
                                             @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updateWorkModel(workModel, id));
    }

    @PutMapping("/updateWorkTime")
    public ResponseEntity<?> updateWorkTime(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                            @Size(max = Utils.Const.MAX_JOB_ADV_WORK_TIME) String workTime,
                                            @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updateWorkTime(workTime, id));
    }

    @PutMapping(value = "/updateDeadLine")
    public ResponseEntity<?> updateDeadLine(@RequestParam(required = false) @Future(message = MSGs.ForAnnotation.PAST_OR_PRESENT) LocalDate deadLine,
                                            @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updateDeadLine(deadLine, id));
    }

    @PutMapping(value = "/updateOpenPositions")
    public ResponseEntity<?> updateOpenPositions(@RequestParam @Positive(message = MSGs.ForAnnotation.NOT_POSITIVE) short number,
                                                 @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updateOpenPositions(number, id));
    }

    @PutMapping(value = "/applyUpdates")
    public ResponseEntity<?> applyUpdates(@RequestParam int jobAdvId) {
        return Utils.getResponseEntity(jobAdvService.applyUpdates(jobAdvId));
    }

    @PutMapping("/updateActivation")
    public ResponseEntity<?> updateActivation(@RequestParam boolean status, @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updateActivation(status, id));
    }

    @PutMapping("/updateVerification")
    public ResponseEntity<?> updateVerification(@RequestParam boolean status, @RequestParam int id) {
        return Utils.getResponseEntity(jobAdvService.updateVerification(status, id));
    }

}
