package com.hrms.lecture6hw2.dataAccess.abstracts;

import com.hrms.lecture6hw2.entities.concretes.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerDao extends JpaRepository<Employer,Integer> {
}
