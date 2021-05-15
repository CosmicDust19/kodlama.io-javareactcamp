package com.hrms.lecture6hw2.api.controllers;

import com.hrms.lecture6hw2.business.abstracts.CandidateService;
import com.hrms.lecture6hw2.entities.concretes.Candidate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandicatesController {

    private final CandidateService candidateService;

    @Autowired
    public CandicatesController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/getall")
    public List<Candidate> getAll(){
        return candidateService.getAll();
    }
}
