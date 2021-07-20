package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.CandidateLanguageService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateLanguageAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

@CrossOrigin
@Validated
@RestController
@RequestMapping("/api/cvsLanguages")
@RequiredArgsConstructor
public class CandidateLanguagesController {

    private final CandidateLanguageService candidateLanguageService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(candidateLanguageService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody CandidateLanguageAddDto candidateLanguageAddDto) {
        return Utils.getResponseEntity(candidateLanguageService.add(candidateLanguageAddDto));
    }

    @DeleteMapping(value = "/deleteById")
    public ResponseEntity<?> deleteById(@RequestParam int id) {
        return Utils.getResponseEntity(candidateLanguageService.deleteById(id));
    }

    @PutMapping(value = "/updateLanguage")
    public ResponseEntity<?> updateLanguage(@RequestParam short languageId, @RequestParam int id) {
        return Utils.getResponseEntity(candidateLanguageService.updateLanguage(languageId, id));
    }

    @PutMapping(value = "/updateLangLevel")
    public ResponseEntity<?> updateLangLevel(@RequestParam
                                             @Pattern(regexp = Utils.Const.LANG_LVL_REGEXP, message = MSGs.ForAnnotation.INVALID_LANG_LVL) String languageLevel,
                                             @RequestParam int id) {
        return Utils.getResponseEntity(candidateLanguageService.updateLangLevel(languageLevel, id));
    }

}
