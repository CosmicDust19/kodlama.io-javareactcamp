package com.hrms.lecture6hw2.api.controllers;

import com.hrms.lecture6hw2.business.abstracts.EmployerService;
import com.hrms.lecture6hw2.entities.concretes.Employer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employers")
public class EmployersController {

    private final EmployerService employerService;

    @Autowired
    public EmployersController(EmployerService employerService) {
        this.employerService = employerService;
    }

    @GetMapping("/getall")
    public List<Employer> getAll(){
        return employerService.getAll();
    }
}
