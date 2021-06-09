package com.hrms.hw.dataAccess.abstracts;


import com.hrms.hw.entities.concretes.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerDao extends JpaRepository<Employer,Integer> {
}
