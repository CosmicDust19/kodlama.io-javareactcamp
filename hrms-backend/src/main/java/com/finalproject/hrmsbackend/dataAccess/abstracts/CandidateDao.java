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
public interface CandidateDao extends JpaRepository<Candidate,Integer> {
    boolean existsByEmailAndPassword(String email, String password);

    boolean existsByEmail(String email);

    boolean existsByNationalityId(String nationalityId);

    Candidate getByEmailAndPassword(String email, String password);

    @Modifying
    @Query("update Candidate candidate set candidate.email = :email where candidate.id = :id")
    void updateEmail(@Param(value = "email") String email, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Candidate candidate set candidate.password = :password where candidate.id = :id")
    void updatePassword(@Param(value = "password") String password, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Candidate candidate set candidate.githubAccountLink = :githubAccountLink where candidate.id = :id")
    void updateGithubAccountLink(@Param(value = "githubAccountLink") String githubAccountLink, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Candidate candidate set candidate.linkedinAccountLink = :linkedinAccountLink where candidate.id = :id")
    void updateLinkedinAccountLink(@Param(value = "linkedinAccountLink") String linkedinAccountLink, @Param(value = "id") Integer id);

    @Query(value = "select exists(select 1 from candidates_favorite_job_advertisements where job_advertisement_id= :jobAdvertisementId and candidate_id = :candidateId)", nativeQuery = true)
    boolean existsFavoriteCandidateJobAdvertisement(@Param(value = "jobAdvertisementId") Integer jobAdvertisementId, @Param(value = "candidateId") Integer candidateId);

    @Modifying
    @Query(value = "INSERT INTO candidates_favorite_job_advertisements VALUES (:candidateId, :jobAdvertisementId)", nativeQuery = true)
    void addJobAdvertisementToCandidateFavorites(@Param(value = "jobAdvertisementId") Integer jobAdvertisementId, @Param(value = "candidateId") Integer candidateId);

    @Modifying
    @Query(value = "DELETE FROM candidates_favorite_job_advertisements WHERE candidate_id = :candidateId AND job_advertisement_id = :jobAdvertisementId", nativeQuery = true)
    void deleteJobExperienceFromCandidateCv(@Param(value = "jobAdvertisementId") Integer jobAdvertisementId, @Param(value = "candidateId") Integer candidateId);

}
