package com.hrms.lecture6hw2.api.controllers;

import com.hrms.lecture6hw2.business.abstracts.JobService;
import com.hrms.lecture6hw2.entities.concretes.Job;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobsController {

    private final JobService jobService;

    @Autowired
    public JobsController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/getall")
    public List<Job> getAll(){
        return jobService.getAll();
    }
}
