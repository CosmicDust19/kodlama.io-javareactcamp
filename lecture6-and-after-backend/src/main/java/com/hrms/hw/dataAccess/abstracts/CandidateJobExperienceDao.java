package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.CandidateJobExperience;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateJobExperienceDao extends JpaRepository<CandidateJobExperience, Integer> {
}
