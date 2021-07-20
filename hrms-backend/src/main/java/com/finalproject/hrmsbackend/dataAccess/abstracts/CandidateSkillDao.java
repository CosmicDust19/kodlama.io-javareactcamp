package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSkill;
import com.finalproject.hrmsbackend.entities.concretes.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateSkillDao extends JpaRepository<CandidateSkill, Integer> {

    boolean existsByCandidateAndSkill(Candidate candidate, Skill skill);

}
