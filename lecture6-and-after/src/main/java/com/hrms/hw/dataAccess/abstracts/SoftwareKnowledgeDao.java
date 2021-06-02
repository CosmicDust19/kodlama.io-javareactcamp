package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.SoftwareKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SoftwareKnowledgeDao extends JpaRepository<SoftwareKnowledge, Integer> {
}
