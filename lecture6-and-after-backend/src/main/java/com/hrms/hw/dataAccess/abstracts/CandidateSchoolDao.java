package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.CandidateSchool;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateSchoolDao extends JpaRepository<CandidateSchool, Integer> {
}
