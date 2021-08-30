package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.LanguageService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@Validated
@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
public class LanguagesController {

    private final LanguageService languageService;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(languageService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                 @Size(max = Utils.Const.MAX_LANGUAGE_NAME, message = Msg.Annotation.SIZE) String languageName) {
        return Utils.getResponseEntity(languageService.add(languageName));
    }

}
