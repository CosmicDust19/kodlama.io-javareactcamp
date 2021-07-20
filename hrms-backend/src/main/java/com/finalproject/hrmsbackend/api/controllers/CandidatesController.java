package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Size;

@CrossOrigin
@Validated
@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidatesController {

    private final CandidateService candidateService;

    @GetMapping("/existsByNatId")
    public ResponseEntity<?> existsByNatId(@RequestParam String nationalityId) {
        return Utils.getResponseEntity(candidateService.existsByNatId(nationalityId));
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(candidateService.getAll());
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam int id) {
        return Utils.getResponseEntity(candidateService.getById(id));
    }

    @GetMapping("/getByEmailAndPW")
    public ResponseEntity<?> getByEmailAndPW(@RequestParam String email, @RequestParam String password) {
        return Utils.getResponseEntity(candidateService.getByEmailAndPW(email, password));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateAddDto candidateAddDto) {
        return Utils.getResponseEntity(candidateService.add(candidateAddDto));
    }

    @PutMapping(value = "/updateGithubAccount")
    public ResponseEntity<?> updateGithubAccount(@RequestParam(required = false)
                                                 @Size(min = Utils.Const.MIN_ACCOUNT_LINK, max = Utils.Const.MAX_ACCOUNT_LINK) String githubAccountLink,
                                                 @RequestParam int id) {
        return Utils.getResponseEntity(candidateService.updateGithubAccount(githubAccountLink, id));
    }

    @PutMapping(value = "/updateLinkedinAccount")
    public ResponseEntity<?> updateLinkedinAccount(@RequestParam(required = false)
                                                   @Size(min = Utils.Const.MIN_ACCOUNT_LINK, max = Utils.Const.MAX_ACCOUNT_LINK) String linkedinAccountLink, @RequestParam int id) {
        return Utils.getResponseEntity(candidateService.updateLinkedinAccount(linkedinAccountLink, id));
    }

    @PutMapping(value = "/addJobAdvToFavorites")
    public ResponseEntity<?> addJobAdvToFavorites(@RequestParam int jobAdvId, @RequestParam int id) {
        return Utils.getResponseEntity(candidateService.updateFavoriteJobAdverts(jobAdvId, id, Utils.UpdateType.ADD));
    }

    @PutMapping(value = "/deleteJobAdvFromFavorites")
    public ResponseEntity<?> deleteJobAdvFromFavorites(@RequestParam int jobAdvId, @RequestParam int id) {
        return Utils.getResponseEntity(candidateService.updateFavoriteJobAdverts(jobAdvId, id, Utils.UpdateType.DEL));
    }

}
