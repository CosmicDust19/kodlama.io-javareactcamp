package com.finalproject.hrmsbackend.dataAccess.abstracts;

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

    boolean existsByWorkPlaceAndPosition_IdAndCandidate_Id(String workplace, Short positionId, Integer candidateId);

    @Modifying
    @Query("update CandidateJobExperience cJ set cJ.workPlace = :workPlace where cJ.id = :id")
    void updateWorkPlace(@Param(value = "workPlace") String workPlace, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateJobExperience cJ set cJ.position = :position where cJ.id = :id")
    void updatePosition(@Param(value = "position") Position position, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateJobExperience cJ set cJ.startYear = :startYear where cJ.id = :id")
    void updateStartYear(@Param(value = "startYear") Short startYear, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateJobExperience cJ set cJ.quitYear = :quitYear where cJ.id = :id")
    void updateQuitYear(@Param(value = "quitYear") Short quitYear, @Param(value = "id") Integer id);

}
