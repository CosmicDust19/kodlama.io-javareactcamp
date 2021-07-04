package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.CandidateCv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface CandidateCvDao extends JpaRepository<CandidateCv, Integer> {

    boolean existsByTitleAndCandidate(String title, Candidate candidate);

    @Modifying
    @Query("update CandidateCv cv set cv.title = :title where cv.id = :id")
    void updateTitle(@Param(value = "title") String title, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateCv cv set cv.coverLetter = :coverLetter where cv.id = :id")
    void updateCoverLetter(@Param(value = "coverLetter") String coverLetter, @Param(value = "id") Integer id);

    @Query(value = "select exists(select 1 from candidates_cvs_job_experiences where cv_id= :cvId and candidate_job_exp_id = :candidateJobExperienceId)", nativeQuery = true)
    boolean existsCandidateJobExperienceInCv(@Param(value = "candidateJobExperienceId") Integer candidateJobExperienceId, @Param(value = "cvId") Integer cvId);

    @Query(value = "select exists(select 1 from candidates_cvs_languages where cv_id= :cvId and candidate_language_id = :candidateLanguageId)", nativeQuery = true)
    boolean existsCandidateLanguageInCv(@Param(value = "candidateLanguageId") Integer candidateLanguageId, @Param(value = "cvId") Integer cvId);

    @Query(value = "select exists(select 1 from candidates_cvs_schools where cv_id= :cvId and candidate_school_id = :candidateSchoolId)", nativeQuery = true)
    boolean existsCandidateSchoolInCv(@Param(value = "candidateSchoolId") Integer candidateSchoolId, @Param(value = "cvId") Integer cvId);

    @Query(value = "select exists(select 1 from candidates_cvs_skills where cv_id= :cvId and candidate_skill_id = :candidateSkillId)", nativeQuery = true)
    boolean existsCandidateSkillInCv(@Param(value = "candidateSkillId") Integer candidateSkillId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "INSERT INTO candidates_cvs_job_experiences VALUES (:cvId, :candidateJobExperienceId)", nativeQuery = true)
    void addJobExperienceToCandidateCv(@Param(value = "candidateJobExperienceId") Integer candidateJobExperienceId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "INSERT INTO candidates_cvs_languages VALUES (:cvId, :candidateLanguageId)", nativeQuery = true)
    void addLanguageToCandidateCv(@Param(value = "candidateLanguageId") Integer candidateLanguageId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "INSERT INTO candidates_cvs_schools VALUES (:cvId, :candidateSchoolId)", nativeQuery = true)
    void addSchoolToCandidateCv(@Param(value = "candidateSchoolId") Integer candidateSchoolId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "INSERT INTO candidates_cvs_skills VALUES (:cvId, :candidateSkillId)", nativeQuery = true)
    void addSkillToToCandidateCv(@Param(value = "candidateSkillId") Integer candidateSkillId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "DELETE FROM candidates_cvs_job_experiences WHERE cv_id = :cvId AND candidate_job_exp_id = :candidateJobExperienceId", nativeQuery = true)
    void deleteJobExperienceFromCandidateCv(@Param(value = "candidateJobExperienceId") Integer candidateJobExperienceId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "DELETE FROM candidates_cvs_languages WHERE cv_id = :cvId AND candidate_language_id = :candidateLanguageId", nativeQuery = true)
    void deleteLanguageFromCandidateCv(@Param(value = "candidateLanguageId") Integer candidateLanguageId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "DELETE FROM candidates_cvs_schools WHERE cv_id = :cvId AND candidate_school_id = :candidateSchoolId", nativeQuery = true)
    void deleteSchoolFromCandidateCv(@Param(value = "candidateSchoolId") Integer candidateSchoolId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "DELETE FROM candidates_cvs_skills WHERE cv_id = :cvId AND candidate_skill_id = :candidateSkillId", nativeQuery = true)
    void deleteSkillFromCandidateCv(@Param(value = "candidateSkillId") Integer candidateSkillId, @Param(value = "cvId") Integer cvId);

}
