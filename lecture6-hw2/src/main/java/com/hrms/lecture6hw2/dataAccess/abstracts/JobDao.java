package com.hrms.lecture6hw2.dataAccess.abstracts;

import com.hrms.lecture6hw2.entities.concretes.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobDao extends JpaRepository<Job,Integer> {
}
