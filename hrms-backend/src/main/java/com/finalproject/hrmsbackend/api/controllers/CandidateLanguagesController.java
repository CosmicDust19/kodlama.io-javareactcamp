package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateLanguageService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateLanguageAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@Validated
@RestController
@RequestMapping("/api/candidateLanguages")
@RequiredArgsConstructor
public class CandidateLanguagesController {

    private final CandidateLanguageService candidateLanguageService;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(candidateLanguageService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateLanguageAddDto candidateLanguageAddDto) {
        return Utils.getResponseEntity(candidateLanguageService.add(candidateLanguageAddDto));
    }

    @DeleteMapping(value = "/delete/byId")
    public ResponseEntity<?> deleteById(@RequestParam int CandLangId) {
        return Utils.getResponseEntity(candidateLanguageService.deleteById(CandLangId));
    }

    @PutMapping(value = "/update/language")
    public ResponseEntity<?> updateLanguage(@RequestParam short languageId, @RequestParam int CandLangId) {
        return Utils.getResponseEntity(candidateLanguageService.updateLanguage(languageId, CandLangId));
    }

    @PutMapping(value = "/update/langLevel")
    public ResponseEntity<?> updateLangLevel(@RequestParam
                                             @Pattern(regexp = Utils.Const.LANG_LVL_REGEXP,
                                                      message = Msg.Annotation.PATTERN + " (It should be A1, A2 etc.)") String languageLevel,
                                             @RequestParam int CandLangId) {
        return Utils.getResponseEntity(candidateLanguageService.updateLangLevel(languageLevel, CandLangId));
    }

}
