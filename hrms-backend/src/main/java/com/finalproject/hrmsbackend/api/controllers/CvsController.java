package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CvService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
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
import java.util.List;

@CrossOrigin
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

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(cvService.getAll());
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam int id) {
        return Utils.getResponseEntity(cvService.getById(id));
    }

    @PostMapping(value = "/add")
    public ResponseEntity<?> add(@Valid @RequestBody CvAddDto cvAddDto) {
        return Utils.getResponseEntity(cvService.add(cvAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public ResponseEntity<?> deleteById(@RequestParam int id) {
        return Utils.getResponseEntity(cvService.deleteById(id));
    }

    @PutMapping(value = "/updateTitle")
    public ResponseEntity<?> updateTitle(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                         @Size(max = Utils.Const.MAX_CV_TITLE) String title, @RequestParam int id) {
        return Utils.getResponseEntity(cvService.updateTitle(title, id));
    }

    @PutMapping(value = "/updateCoverLetter")
    public ResponseEntity<?> updateCoverLetter(@RequestParam(required = false)
                                               @Size(max = Utils.Const.MAX_CV_COVER_LETTER) String coverLetter, @RequestParam int id) {
        return Utils.getResponseEntity(cvService.updateCoverLetter(coverLetter, id));
    }

    @PutMapping(value = "/addToCv/JobExps")
    public ResponseEntity<?> addJobExpsToCv(@RequestParam List<@NotNull Integer> candidateJobExpIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.addPropsToCv(cvId, candidateJobExpIds, candidateJobExpDao, Utils.CheckType.ALL, CandidateJobExperience.class));
    }

    @PutMapping(value = "/addToCv/Langs")
    public ResponseEntity<?> addLangsToCv(@RequestParam List<@NotNull Integer> candidateLangIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.addPropsToCv(cvId, candidateLangIds, candidateLangDao, Utils.CheckType.ALL, CandidateLanguage.class));
    }

    @PutMapping(value = "/addToCv/Schools")
    public ResponseEntity<?> addSchoolsToCv(@RequestParam List<@NotNull Integer> candidateSchoolIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.addPropsToCv(cvId, candidateSchoolIds, candidateSchoolDao, Utils.CheckType.ALL, CandidateSchool.class));
    }

    @PutMapping(value = "/addToCv/Skills")
    public ResponseEntity<?> addSkillsToCv(@RequestParam List<@NotNull Integer> candidateSkillIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.addPropsToCv(cvId, candidateSkillIds, candidateSkillDao, Utils.CheckType.ALL, CandidateSkill.class));
    }

    @PutMapping(value = "/deleteFromCv/JobExps")
    public ResponseEntity<?> deleteJobExpsFromCv(@RequestParam List<@NotNull Integer> candidateJobExpIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.deletePropsFromCv(cvId, candidateJobExpIds, Utils.CheckType.ALL, CandidateJobExperience.class));
    }

    @PutMapping(value = "/deleteFromCv/Langs")
    public ResponseEntity<?> deleteLangsFromCv(@RequestParam List<@NotNull Integer> candidateLangIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.deletePropsFromCv(cvId, candidateLangIds, Utils.CheckType.ALL, CandidateLanguage.class));
    }

    @PutMapping(value = "/deleteFromCv/Schools")
    public ResponseEntity<?> deleteSchoolsFromCv(@RequestParam List<@NotNull Integer> candidateSchoolIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.deletePropsFromCv(cvId, candidateSchoolIds, Utils.CheckType.ALL, CandidateSchool.class));
    }

    @PutMapping(value = "/deleteFromCv/Skills")
    public ResponseEntity<?> deleteSkillsFromCv(@RequestParam List<@NotNull Integer> candidateSkillIds, @RequestParam int cvId) {
        return Utils.getResponseEntity(cvService.deletePropsFromCv(cvId, candidateSkillIds, Utils.CheckType.ALL, CandidateSkill.class));
    }

}
