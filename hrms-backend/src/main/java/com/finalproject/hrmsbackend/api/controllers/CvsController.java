package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CvService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateJobExperienceDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateLanguageDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateSchoolDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateSkillDao;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
import com.finalproject.hrmsbackend.entities.concretes.CandidateLanguage;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSchool;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSkill;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CvAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@Validated
@RestController
@RequestMapping("/api/cvs")
@RequiredArgsConstructor
public class CvsController {

    private final CvService cvService;
    private final CandidateJobExperienceDao candidateJobExpDao;
    private final CandidateLanguageDao candidateLangDao;
    private final CandidateSchoolDao candidateSchoolDao;
    private final CandidateSkillDao candidateSkillDao;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(cvService.getAll());
    }

    @GetMapping("/get/byId")
    public ResponseEntity<?> getById(@RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.getById(cvId));
    }

    @PostMapping(value = "/add")
    public ResponseEntity<?> add(@Valid @RequestBody CvAddDto cvAddDto) {
        return Utils.getResponseEntity(cvService.add(cvAddDto));
    }

    @DeleteMapping(value = "/delete/byId")
    public ResponseEntity<?> deleteById(@RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.deleteById(cvId));
    }

    @PutMapping(value = "/update/title")
    public ResponseEntity<?> updateTitle(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                         @Size(max = Utils.Const.MAX_CV_TITLE, message = Msg.Annotation.SIZE) String title, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.updateTitle(title, cvId));
    }

    @PutMapping(value = "/update/coverLetter")
    public ResponseEntity<?> updateCoverLetter(@RequestParam(required = false)
                                               @Size(max = Utils.Const.MAX_CV_COVER_LETTER, message = Msg.Annotation.SIZE) String coverLetter, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.updateCoverLetter(coverLetter, cvId));
    }

    @PutMapping(value = "/update/image")
    public ResponseEntity<?> updateImage(@RequestParam(required = false) Integer imgId, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.updateImg(imgId, cvId));
    }

    @PutMapping(value = "/update/jobExps/add")
    public ResponseEntity<?> addJobExpsToCv(@RequestParam Set<@NotNull Integer> candJobExpIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.addCandidatePropsToCv(cvId, candJobExpIds, candidateJobExpDao, Utils.CheckType.ALL, CandidateJobExperience.class));
    }

    @PutMapping(value = "/update/langs/add")
    public ResponseEntity<?> addLangsToCv(@RequestParam Set<@NotNull Integer> candLangIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.addCandidatePropsToCv(cvId, candLangIds, candidateLangDao, Utils.CheckType.ALL, CandidateLanguage.class));
    }

    @PutMapping(value = "/update/schools/add")
    public ResponseEntity<?> addSchoolsToCv(@RequestParam Set<@NotNull Integer> candSchoolIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.addCandidatePropsToCv(cvId, candSchoolIds, candidateSchoolDao, Utils.CheckType.ALL, CandidateSchool.class));
    }

    @PutMapping(value = "/update/skills/add")
    public ResponseEntity<?> addSkillsToCv(@RequestParam Set<@NotNull Integer> candSkillIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.addCandidatePropsToCv(cvId, candSkillIds, candidateSkillDao, Utils.CheckType.ALL, CandidateSkill.class));
    }

    @PutMapping(value = "/update/jobExps/remove")
    public ResponseEntity<?> removeJobExpsFromCv(@RequestParam Set<@NotNull Integer> candJobExpIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.removePropsFromCv(cvId, candJobExpIds, Utils.CheckType.ALL, CandidateJobExperience.class));
    }

    @PutMapping(value = "/update/langs/remove")
    public ResponseEntity<?> removeLangsFromCv(@RequestParam Set<@NotNull Integer> candLangIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.removePropsFromCv(cvId, candLangIds, Utils.CheckType.ALL, CandidateLanguage.class));
    }

    @PutMapping(value = "/update/schools/remove")
    public ResponseEntity<?> removeSchoolsFromCv(@RequestParam Set<@NotNull Integer> candSchoolIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.removePropsFromCv(cvId, candSchoolIds, Utils.CheckType.ALL, CandidateSchool.class));
    }

    @PutMapping(value = "/update/skills/remove")
    public ResponseEntity<?> removeSkillsFromCv(@RequestParam Set<@NotNull Integer> candSkillIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.removePropsFromCv(cvId, candSkillIds, Utils.CheckType.ALL, CandidateSkill.class));
    }

}
