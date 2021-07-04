package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.CandidateLanguage;
import com.finalproject.hrmsbackend.entities.concretes.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface CandidateLanguageDao extends JpaRepository<CandidateLanguage, Integer> {
    CandidateLanguage getByCandidateAndLanguage(Candidate candidate, Language language);

    boolean existsByCandidateAndLanguage(Candidate candidate, Language language);

    @Modifying
    @Query("update CandidateLanguage candidateLanguage set candidateLanguage.language = :language where candidateLanguage.id = :id")
    void updateLanguage(@Param(value = "language") Language language, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateLanguage candidateLanguage set candidateLanguage.languageLevel = :languageLevel where candidateLanguage.id = :id")
    void updateLanguageLevel(@Param(value = "languageLevel") String languageLevel, @Param(value = "id") Integer id);

}
