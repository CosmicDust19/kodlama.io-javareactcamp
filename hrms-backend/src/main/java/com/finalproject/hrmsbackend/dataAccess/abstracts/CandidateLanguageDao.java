package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.CandidateLanguage;
import com.finalproject.hrmsbackend.entities.concretes.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateLanguageDao extends JpaRepository<CandidateLanguage, Integer> {
    CandidateLanguage getByCandidateAndLanguage(Candidate candidate, Language language);
    boolean existsByCandidateAndLanguage(Candidate candidate, Language language);
}
