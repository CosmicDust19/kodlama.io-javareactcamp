package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
import com.finalproject.hrmsbackend.entities.concretes.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface CandidateJobExperienceDao extends JpaRepository<CandidateJobExperience, Integer> {
    CandidateJobExperience getByCandidateAndWorkPlaceAndPosition(Candidate candidate, String workPlace, Position position);

    Boolean existsByCandidateAndWorkPlaceAndPosition(Candidate candidate, String workPlace, Position position);

    Boolean existsByIdAndCandidate(Integer id, Candidate candidate);

    @Modifying
    @Query("update CandidateJobExperience candidateJobExperience set candidateJobExperience.workPlace = :workPlace where candidateJobExperience.id = :id")
    void updateWorkPlace(@Param(value = "workPlace") String workPlace, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateJobExperience candidateJobExperience set candidateJobExperience.position = :position where candidateJobExperience.id = :id")
    void updatePosition(@Param(value = "position") Position position, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateJobExperience candidateJobExperience set candidateJobExperience.startYear = :startYear where candidateJobExperience.id = :id")
    void updateStartYear(@Param(value = "startYear") Short startYear, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateJobExperience candidateJobExperience set candidateJobExperience.quitYear = :quitYear where candidateJobExperience.id = :id")
    void updateQuitYear(@Param(value = "quitYear") Short quitYear, @Param(value = "id") Integer id);

}
