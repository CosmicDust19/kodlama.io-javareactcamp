package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Size;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@Validated
@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidatesController {

    private final CandidateService candidateService;

    @GetMapping("/exists/byNatId")
    public ResponseEntity<?> existsByNatId(@RequestParam String nationalityId) {
        return Utils.getResponseEntity(candidateService.existsByNatId(nationalityId));
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(candidateService.getAll());
    }

    @GetMapping("/get/byId")
    public ResponseEntity<?> getById(@RequestParam int candId) {
        return Utils.getResponseEntity(candidateService.getById(candId));
    }

    @GetMapping("/get/byEmailAndPW")
    public ResponseEntity<?> getByEmailAndPW(@RequestParam String email, @RequestParam String password) {
        return Utils.getResponseEntity(candidateService.getByEmailAndPW(email, password));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateAddDto candidateAddDto) {
        return Utils.getResponseEntity(candidateService.add(candidateAddDto));
    }

    @PutMapping(value = "/update/githubAccount")
    public ResponseEntity<?> updateGithubAccount(@RequestParam(required = false)
                                                 @Size(min = Utils.Const.MIN_ACCOUNT_LINK, max = Utils.Const.MAX_ACCOUNT_LINK, message = Msg.Annotation.SIZE) String githubAccount,
                                                 @RequestParam int candId) {
        return Utils.getResponseEntity(candidateService.updateGithubAccount(githubAccount, candId));
    }

    @PutMapping(value = "/update/linkedinAccount")
    public ResponseEntity<?> updateLinkedinAccount(@RequestParam(required = false)
                                                   @Size(min = Utils.Const.MIN_ACCOUNT_LINK, max = Utils.Const.MAX_ACCOUNT_LINK, message = Msg.Annotation.SIZE) String linkedinAccount,
                                                   @RequestParam int candId) {
        return Utils.getResponseEntity(candidateService.updateLinkedinAccount(linkedinAccount, candId));
    }

    @PutMapping(value = "/update/favoriteJobAdvs/add")
    public ResponseEntity<?> addJobAdvToFavorites(@RequestParam int jobAdvId, @RequestParam int candId) {
        return Utils.getResponseEntity(candidateService.updateFavoriteJobAdverts(jobAdvId, candId, Utils.UpdateType.ADD));
    }

    @PutMapping(value = "/update/favoriteJobAdvs/remove")
    public ResponseEntity<?> removeJobAdvFromFavorites(@RequestParam int jobAdvId, @RequestParam int candId) {
        return Utils.getResponseEntity(candidateService.updateFavoriteJobAdverts(jobAdvId, candId, Utils.UpdateType.DEL));
    }

}
