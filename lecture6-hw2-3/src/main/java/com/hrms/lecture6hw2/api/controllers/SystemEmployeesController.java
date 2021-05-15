package com.hrms.lecture6hw2.api.controllers;

import com.hrms.lecture6hw2.business.abstracts.SystemEmployeeService;
import com.hrms.lecture6hw2.entities.concretes.SystemEmployee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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
    public List<SystemEmployee> getAll(){
        return systemEmployeeService.getAll();
    }
}
