package com.hrms.hw.api.controllers;

import com.hrms.hw.business.abstracts.SystemEmployeeService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.SystemEmployee;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/system_employees")
public class SystemEmployeesController {

    private final SystemEmployeeService systemEmployeeService;


    @GetMapping("/getall")
    public DataResult<List<SystemEmployee>> getAll(){
        return systemEmployeeService.getAll();
    }

    @PostMapping("/add")
    public Result add(@RequestBody SystemEmployee systemEmployee){
        return systemEmployeeService.add(systemEmployee);
    }
}
