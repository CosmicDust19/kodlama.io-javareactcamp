package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.EmployerService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
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

@CrossOrigin
@Validated
@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployersController {

    private final EmployerService employerService;

    @GetMapping("/existsByCompanyName")
    public ResponseEntity<?> existsByCompanyName(@RequestParam String companyName) {
        return Utils.getResponseEntity(employerService.existsByCompanyName(companyName));
    }

    @GetMapping("/existsByWebsite")
    public ResponseEntity<?> existsByWebsite(@RequestParam String website) {
        return Utils.getResponseEntity(employerService.existsByWebsite(website));
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(employerService.getAll());
    }

    @GetMapping("/getPublicEmployers")
    public ResponseEntity<?> getPublicEmployers() {
        return Utils.getResponseEntity(employerService.getAllVerified());
    }

    @GetMapping("/getUnverified")
    public ResponseEntity<?> getUnverified() {
        return Utils.getResponseEntity(employerService.getAllUnverified());
    }

    @GetMapping("/getById")
    public ResponseEntity<?> getById(@RequestParam int id) {
        return Utils.getResponseEntity(employerService.getById(id));
    }

    @GetMapping("/getByEmailAndPW")
    public ResponseEntity<?> getByEmailAndPW(@RequestParam String email, @RequestParam String password) {
        return Utils.getResponseEntity(employerService.getByEmailAndPW(email, password));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody EmployerAddDto employerAddDto) {
        return Utils.getResponseEntity(employerService.add(employerAddDto));
    }

    @PutMapping(value = "/updateEmailAndWebsite")
    public ResponseEntity<?> updateEmailAndWebsite(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                                   @Pattern(regexp = Utils.Const.EMAIL_REGEXP, message = MSGs.ForAnnotation.INVALID_FORMAT) String email,
                                                   @RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                                   @Pattern(regexp = Utils.Const.WEBSITE_REGEXP, message = MSGs.ForAnnotation.INVALID_FORMAT) String website,
                                                   @RequestParam int id) {
        return Utils.getResponseEntity(employerService.updateEmailAndWebsite(email, website, id));
    }

    @PutMapping(value = "/updateCompanyName")
    public ResponseEntity<?> updateCompanyName(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                               @Size(max = Utils.Const.MAX_COMPANY_NAME) String companyName,
                                               @RequestParam int id) {
        return Utils.getResponseEntity(employerService.updateCompanyName(companyName, id));
    }

    @PutMapping(value = "/updatePhoneNumber")
    public ResponseEntity<?> updatePhoneNumber(@RequestParam @NotBlank(message = MSGs.ForAnnotation.EMPTY)
                                               @Pattern(regexp = Utils.Const.PHONE_NUM_REGEXP, message = MSGs.ForAnnotation.INVALID_FORMAT) String phoneNumber,
                                               @RequestParam int id) {
        return Utils.getResponseEntity(employerService.updatePhoneNumber(phoneNumber, id));
    }

    @PutMapping(value = "/applyUpdates")
    public ResponseEntity<?> applyUpdates(@RequestParam int jobAdvId) {
        return Utils.getResponseEntity(employerService.applyUpdates(jobAdvId));
    }

    @PutMapping(value = "/updateVerification")
    public ResponseEntity<?> updateVerification(@RequestParam boolean status, @RequestParam int id) {
        return Utils.getResponseEntity(employerService.updateVerification(status, id));
    }

}
