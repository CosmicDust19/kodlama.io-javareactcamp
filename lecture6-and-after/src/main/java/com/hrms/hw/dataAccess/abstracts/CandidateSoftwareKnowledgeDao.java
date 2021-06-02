package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.CandidateSoftwareKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateSoftwareKnowledgeDao extends JpaRepository<CandidateSoftwareKnowledge, Integer> {
}
