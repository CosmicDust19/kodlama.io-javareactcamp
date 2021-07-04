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

}
