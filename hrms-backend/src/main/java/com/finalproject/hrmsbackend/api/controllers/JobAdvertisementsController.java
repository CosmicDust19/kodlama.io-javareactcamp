package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.JobAdvertisementService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/jobAdvertisements")
public class JobAdvertisementsController {

    private final JobAdvertisementService jobAdvertisementService;

    @GetMapping("/getAll")
    public DataResult<List<JobAdvertisement>> getAll() {
        return jobAdvertisementService.getAll();
    }

    @GetMapping("/getAllActives")
    public DataResult<List<JobAdvertisement>> getAllActives() {
        return jobAdvertisementService.getAllActivesAndVerified();
    }

    @GetMapping("/getAllActivesSortedByDate")
    public DataResult<List<JobAdvertisement>> getAllActivesSortedByDate(@RequestParam int sortDirection) {
        return jobAdvertisementService.getAllActivesAndVerifiedSortedByDate(sortDirection);
    }

    @GetMapping("/getByActivationStatusTrueAndEmployerId")
    public DataResult<List<JobAdvertisement>> getByActivationStatusTrueAndEmployer_Id(@RequestParam int employerId) {
        return jobAdvertisementService.getByActivesAndVerifiedAndEmployer_Id(employerId);
    }

    @GetMapping("/getAllBySystemVerificationStatusFalse")
    public DataResult<List<JobAdvertisement>> getAllBySystemVerificationStatusFalse() {
        return jobAdvertisementService.getAllBySystemVerificationStatusFalse();
    }


    @GetMapping("/findAllByActivesAndVerifiedAndApplicationDeadlineFuture")
    public DataResult<List<JobAdvertisement>> findAllByActivesAndVerifiedAndApplicationDeadlineFuture() {
        return jobAdvertisementService.findAllByActivesAndVerifiedAndApplicationDeadlineFuture();
    }


    @GetMapping("/findAllByActivesAndVerifiedAndApplicationDeadlinePast")
    public DataResult<List<JobAdvertisement>> findAllByActivesAndVerifiedAndApplicationDeadlinePast() {
        return jobAdvertisementService.findAllByActivesAndVerifiedAndApplicationDeadlinePast();
    }

    @GetMapping("/getById")
    public DataResult<JobAdvertisement> getById(@RequestParam int jobAdvertisementId) {
        return jobAdvertisementService.getById(jobAdvertisementId);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody @Valid JobAdvertisementAddDto jobAdvertisementAddDto) {
        return ResponseEntity.ok(jobAdvertisementService.add(jobAdvertisementAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public DataResult<Boolean> deleteById(@RequestParam int id) {
        return jobAdvertisementService.deleteById(id);
    }

    @PutMapping(value = "/updatePosition")
    public Result updatePosition(@RequestParam short positionId, @RequestParam int id) {
        return jobAdvertisementService.updatePosition(positionId, id);
    }

    @PutMapping("/updateJobDescription")
    public Result updateJobDescription(@RequestParam String jobDescription, @RequestParam int id) {
        return jobAdvertisementService.updateJobDescription(jobDescription, id);
    }

    @PutMapping("/updateCity")
    public Result updateCity(@RequestParam short cityId, @RequestParam int id) {
        return jobAdvertisementService.updateCity(cityId, id);
    }

    @PutMapping("/updateMinSalary")
    public Result updateMinSalary(@RequestParam Double minSalary, @RequestParam int id) {
        return jobAdvertisementService.updateMinSalary(minSalary, id);
    }

    @PutMapping("/updateMaxSalary")
    public Result updateMaxSalary(@RequestParam Double maxSalary, @RequestParam int id) {
        return jobAdvertisementService.updateMaxSalary(maxSalary, id);
    }

    @PutMapping("/updateWorkModel")
    public Result updateWorkModel(@RequestParam String workModel, @RequestParam int id) {
        return jobAdvertisementService.updateWorkModel(workModel, id);
    }

    @PutMapping("/updateWorkTime")
    public Result updateWorkTime(@RequestParam String workTime, @RequestParam int id) {
        return jobAdvertisementService.updateWorkTime(workTime, id);
    }

    @PutMapping(value = "/updateApplicationDeadLine")
    public Result updateApplicationDeadLine(@RequestParam String applicationDeadLine, @RequestParam int id) {
        return jobAdvertisementService.updateApplicationDeadLine(applicationDeadLine, id);
    }

    @PutMapping("/updateActivationStatus")
    public Result updateActivationStatus(@RequestParam boolean activationStatus, @RequestParam int id) {
        return jobAdvertisementService.updateActivationStatus(activationStatus, id);
    }

    @PutMapping("/updateSystemVerificationStatus")
    public Result updateSystemVerificationStatus(@RequestParam boolean systemVerificationStatus, @RequestParam int id) {
        return jobAdvertisementService.updateSystemVerificationStatus(systemVerificationStatus, id);
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
