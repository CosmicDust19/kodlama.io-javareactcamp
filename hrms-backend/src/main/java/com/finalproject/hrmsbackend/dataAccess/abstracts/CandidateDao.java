package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface CandidateDao extends JpaRepository<Candidate, Integer> {

    boolean existsByEmailAndPassword(String email, String password);

    boolean existsByNationalityId(String nationalityId);

    Candidate getByEmailAndPassword(String email, String password);

    @Modifying
    @Query("update Candidate c set c.githubAccount = :githubAccount where c.id = :id")
    void updateGithubAccount(@Param(value = "githubAccount") String githubAccount, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Candidate c set c.linkedinAccount = :linkedinAccount where c.id = :id")
    void updateLinkedinAccount(@Param(value = "linkedinAccount") String linkedinAccount, @Param(value = "id") Integer id);

    @Modifying
    @Query(value = "INSERT INTO candidates_favorite_job_advertisements VALUES (:candidateId, :jobAdvertisementId)", nativeQuery = true)
    void addJobAdvToFavorites(@Param(value = "jobAdvertisementId") Integer jobAdvertisementId, @Param(value = "candidateId") Integer candidateId);

    @Modifying
    @Query(value = "DELETE FROM candidates_favorite_job_advertisements WHERE candidate_id = :candidateId AND job_advertisement_id = :jobAdvertisementId", nativeQuery = true)
    void deleteJobAdvFromFavorites(@Param(value = "jobAdvertisementId") Integer jobAdvertisementId, @Param(value = "candidateId") Integer candidateId);

}
