package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSkillService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSkillAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@RestController
@RequestMapping("/api/candidateSkills")
@RequiredArgsConstructor
public class CandidateSkillsController {

    private final CandidateSkillService candidateSkillService;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(candidateSkillService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateSkillAddDto candidateSkillAddDto) {
        return Utils.getResponseEntity(candidateSkillService.add(candidateSkillAddDto));
    }

    @PostMapping("/add/multiple")
    public ResponseEntity<?> addMultiple(@Valid @RequestBody List<CandidateSkillAddDto> candidateSkillAddDtos) {
        return Utils.getResponseEntity(candidateSkillService.addMultiple(candidateSkillAddDtos));
    }

    @DeleteMapping(value = "/delete/byId")
    public ResponseEntity<?> deleteById(@RequestParam int candSkillId) {
        return Utils.getResponseEntity(candidateSkillService.deleteById(candSkillId));
    }

}
