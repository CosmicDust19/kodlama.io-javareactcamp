package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.ImageService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = {Utils.Const.LOCALHOST_3000, Utils.Const.HEROKU_APP})
@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImagesController {

    private final ImageService imageService;

    @GetMapping("/get/byId")
    public ResponseEntity<?> getById(@RequestParam int imgId) {
        return Utils.getResponseEntity(imageService.getById(imgId));
    }

    @GetMapping("/get/byPublicId")
    public ResponseEntity<?> getByPublicId(@RequestParam String publicId) {
        return Utils.getResponseEntity(imageService.getByPublicId(publicId));
    }

    @PostMapping(value = "/upload")
    public ResponseEntity<?> upload(@RequestParam MultipartFile multipartFile, @RequestParam int userId) {
        return Utils.getResponseEntity(imageService.upload(multipartFile, userId));
    }

    @DeleteMapping("/delete/byId")
    public ResponseEntity<?> deleteById(@RequestParam int imgId) {
        return Utils.getResponseEntity(imageService.deleteById(imgId));
    }

    @DeleteMapping("/delete/byPublicId")
    public ResponseEntity<?> deleteByPublicId(@RequestParam String publicId) {
        return Utils.getResponseEntity(imageService.deleteByPublicId(publicId));
    }

}
