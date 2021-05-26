package com.hrms.hw.api.controllers;

import com.hrms.hw.business.abstracts.PositionService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.Employer;
import com.hrms.hw.entities.concretes.Position;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
public class PositionsController {

    private final PositionService positionService;

    @Autowired
    public PositionsController(PositionService positionService) {
        this.positionService = positionService;
    }

    @GetMapping("/getall")
    public DataResult<List<Position>> getAll(){
        return positionService.getAll();
    }

    @PostMapping("/add")
    public Result add(Position position){
        return positionService.add(position);
    }
}
