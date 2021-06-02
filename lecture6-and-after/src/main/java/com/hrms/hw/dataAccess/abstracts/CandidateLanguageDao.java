package com.hrms.hw.dataAccess.abstracts;


import com.hrms.hw.entities.concretes.CandidateLanguage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateLanguageDao extends JpaRepository<CandidateLanguage, Integer> {
}
