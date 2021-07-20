package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSkillService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSkillAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("/api/candidateSkills")
@RequiredArgsConstructor
public class CandidateSkillsController {

    private final CandidateSkillService candidateSkillService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(candidateSkillService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateSkillAddDto candidateSkillAddDto) {
        return Utils.getResponseEntity(candidateSkillService.add(candidateSkillAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public ResponseEntity<?> deleteById(@RequestParam int id) {
        return Utils.getResponseEntity(candidateSkillService.deleteById(id));
    }

}
