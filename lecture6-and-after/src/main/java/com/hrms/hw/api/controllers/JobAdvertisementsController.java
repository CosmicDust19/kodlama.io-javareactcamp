package com.hrms.hw.api.controllers;

import com.hrms.hw.business.abstracts.JobAdvertisementService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.JobAdvertisement;
import com.hrms.hw.entities.concretes.dtos.JobAdvertisementAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(name = "api/jobAdvertisements")
public class JobAdvertisementsController {

    private final JobAdvertisementService jobAdvertisementService;

    @GetMapping("getAll")
    DataResult<List<JobAdvertisement>> getAll() {
        return jobAdvertisementService.getAll();
    }

    @GetMapping("getAllActives")
    DataResult<List<JobAdvertisement>> getAllActives() {
        return jobAdvertisementService.getAllActives();
    }

    @GetMapping("getAllActivesSortedByDate")
    DataResult<List<JobAdvertisement>> getAllActivesSortedByDate(@RequestParam int sortDirection) {
        return jobAdvertisementService.getAllActivesSortedByDate(sortDirection);
    }

    @GetMapping("getByActivationStatusTrueAndEmployerId")
    DataResult<List<JobAdvertisement>> getByActivationStatusTrueAndEmployer_Id(@RequestParam int employerId) {
        return jobAdvertisementService.getByActivationStatusTrueAndEmployer_Id(employerId);
    }

    @PostMapping("add")
    Result add(@RequestBody JobAdvertisementAddDto jobAdvertisementAddDto) {
        return jobAdvertisementService.add(jobAdvertisementAddDto);
    }

    @PostMapping("updateActivationStatus")
    Result updateActivationStatus(@RequestParam boolean activationStatus, @RequestParam int jobAdvertisementId) {
        return jobAdvertisementService.updateActivationStatus(activationStatus, jobAdvertisementId);
    }

}
