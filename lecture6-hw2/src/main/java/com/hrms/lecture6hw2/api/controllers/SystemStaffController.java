package com.hrms.lecture6hw2.api.controllers;

import com.hrms.lecture6hw2.business.abstracts.SystemStaffService;
import com.hrms.lecture6hw2.entities.concretes.SystemStaff;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/system_staff")
public class SystemStaffController {

    private final SystemStaffService systemStaffService;

    @Autowired
    public SystemStaffController(SystemStaffService systemStaffService) {
        this.systemStaffService = systemStaffService;
    }

    @GetMapping("/getall")
    public List<SystemStaff> getAll(){
        return systemStaffService.getAll();
    }
}
