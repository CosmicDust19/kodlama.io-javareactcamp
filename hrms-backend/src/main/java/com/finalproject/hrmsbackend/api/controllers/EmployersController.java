package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.EmployerService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.dtos.EmployerAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@Validated
@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployersController {

    private final EmployerService employerService;

    @GetMapping("/exists/byCompanyName")
    public ResponseEntity<?> existsByCompanyName(@RequestParam String companyName) {
        return Utils.getResponseEntity(employerService.existsByCompanyName(companyName));
    }

    @GetMapping("/exists/byWebsite")
    public ResponseEntity<?> existsByWebsite(@RequestParam String website) {
        return Utils.getResponseEntity(employerService.existsByWebsite(website));
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(employerService.getAll());
    }

    @GetMapping("/get/public")
    public ResponseEntity<?> getPublic() {
        return Utils.getResponseEntity(employerService.getVerified());
    }

    @GetMapping("/get/unverified")
    public ResponseEntity<?> getUnverified() {
        return Utils.getResponseEntity(employerService.getUnverified());
    }

    @GetMapping("/get/byId")
    public ResponseEntity<?> getById(@RequestParam int emplId) {
        return Utils.getResponseEntity(employerService.getById(emplId));
    }

    @GetMapping("/get/byEmailAndPW")
    public ResponseEntity<?> getByEmailAndPW(@RequestParam String email, @RequestParam String password) {
        return Utils.getResponseEntity(employerService.getByEmailAndPW(email, password));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody EmployerAddDto employerAddDto) {
        return Utils.getResponseEntity(employerService.add(employerAddDto));
    }

    @PutMapping(value = "/update/emailAndWebsite")
    public ResponseEntity<?> updateEmailAndWebsite(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                                   @Pattern(regexp = Utils.Const.EMAIL_REGEXP, message = Msg.Annotation.PATTERN) String email,
                                                   @RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                                   @Pattern(regexp = Utils.Const.WEBSITE_REGEXP, message = Msg.Annotation.PATTERN) String website,
                                                   @RequestParam int emplId) {
        return Utils.getResponseEntity(employerService.updateEmailAndWebsite(email, website, emplId));
    }

    @PutMapping(value = "/update/companyName")
    public ResponseEntity<?> updateCompanyName(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                               @Size(max = Utils.Const.MAX_COMPANY_NAME, message = Msg.Annotation.SIZE) String companyName,
                                               @RequestParam int emplId) {
        return Utils.getResponseEntity(employerService.updateCompanyName(companyName, emplId));
    }

    @PutMapping(value = "/update/phoneNumber")
    public ResponseEntity<?> updatePhoneNumber(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                               @Pattern(regexp = Utils.Const.PHONE_NUM_REGEXP, message = Msg.Annotation.PATTERN) String phoneNumber,
                                               @RequestParam int emplId) {
        return Utils.getResponseEntity(employerService.updatePhoneNumber(phoneNumber, emplId));
    }

    @PutMapping(value = "/update/applyChanges")
    public ResponseEntity<?> applyChanges(@RequestParam int emplId) {
        return Utils.getResponseEntity(employerService.applyChanges(emplId));
    }

    @PutMapping(value = "/update/verification")
    public ResponseEntity<?> updateVerification(@RequestParam boolean status, @RequestParam int emplId) {
        return Utils.getResponseEntity(employerService.updateVerification(status, emplId));
    }

}
