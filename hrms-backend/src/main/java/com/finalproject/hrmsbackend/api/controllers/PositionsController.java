package com.finalproject.hrmsbackend.api.controllers;

import com.finalproject.hrmsbackend.business.abstracts.PositionService;
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
@RequestMapping("/api/positions")
@RequiredArgsConstructor
public class PositionsController {

    private final PositionService positionService;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAll() {
        return Utils.getResponseEntity(positionService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestParam @NotBlank(message = Msg.Annotation.REQUIRED)
                                 @Size(max = Utils.Const.MAX_POSITION_TITLE, message = Msg.Annotation.SIZE) String positionTitle) {
        return Utils.getResponseEntity(positionService.add(positionTitle));
    }

}
