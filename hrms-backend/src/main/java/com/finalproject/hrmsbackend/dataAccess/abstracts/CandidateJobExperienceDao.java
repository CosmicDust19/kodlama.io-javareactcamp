package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
import com.finalproject.hrmsbackend.entities.concretes.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateJobExperienceDao extends JpaRepository<CandidateJobExperience, Integer> {
    CandidateJobExperience getByCandidateAndWorkPlaceAndPosition(Candidate candidate, String workPlace, Position position);
    boolean existsByCandidateAndWorkPlaceAndPosition(Candidate candidate, String workPlace, Position position);
}
