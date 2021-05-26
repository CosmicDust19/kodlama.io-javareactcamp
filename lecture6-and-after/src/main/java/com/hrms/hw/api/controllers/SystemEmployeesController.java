package com.hrms.hw.api.controllers;

import com.hrms.hw.business.abstracts.SystemEmployeeService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.Employer;
import com.hrms.hw.entities.concretes.SystemEmployee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/system_employees")
public class SystemEmployeesController {

    private final SystemEmployeeService systemEmployeeService;

    @Autowired
    public SystemEmployeesController(SystemEmployeeService systemEmployeeService) {
        this.systemEmployeeService = systemEmployeeService;
    }

    @GetMapping("/getall")
    public DataResult<List<SystemEmployee>> getAll(){
        return systemEmployeeService.getAll();
    }

    @PostMapping("/add")
    public Result add(SystemEmployee systemEmployee){
        return systemEmployeeService.add(systemEmployee);
    }
}
