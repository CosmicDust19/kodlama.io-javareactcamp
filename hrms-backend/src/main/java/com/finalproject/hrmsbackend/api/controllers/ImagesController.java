package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.ImageService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin
@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImagesController {

    private final ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam MultipartFile multipartFile, @RequestParam int userId) {
        return Utils.getResponseEntity(imageService.upload(multipartFile, userId));
    }

    @DeleteMapping("/deleteById")
    public ResponseEntity<?> deleteById(@RequestParam int id) {
        return Utils.getResponseEntity(imageService.deleteById(id));
    }

    @DeleteMapping("/deleteByPublicId")
    public ResponseEntity<?> deleteByPublicId(@RequestParam String publicId) {
        return Utils.getResponseEntity(imageService.deleteByPublicId(publicId));
    }
}
