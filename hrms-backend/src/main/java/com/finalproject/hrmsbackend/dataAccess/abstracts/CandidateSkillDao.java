package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.CandidateSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateSkillDao extends JpaRepository<CandidateSkill, Integer> {

    boolean existsBySkill_IdAndCandidate_Id(Short skillId, Integer candidateId);

}
