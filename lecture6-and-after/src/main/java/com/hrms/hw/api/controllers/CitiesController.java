package com.hrms.hw.api.controllers;

import com.hrms.hw.business.concretes.CityManager;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.entities.concretes.City;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CitiesController {

    private final CityManager cityManager;

    @GetMapping("/getAll")
    public DataResult<List<City>> getAll() {
        return cityManager.getAll();
    }
}
