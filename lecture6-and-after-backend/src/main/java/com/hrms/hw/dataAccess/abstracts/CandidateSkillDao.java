package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.CandidateSkill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateSkillDao extends JpaRepository<CandidateSkill, Integer> {
}
