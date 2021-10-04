package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Cv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

@Transactional
@Repository
public interface CvDao extends JpaRepository<Cv, Integer> {

    boolean existsByTitleAndCandidate_Id(String title, Integer candId);

    @Query(value = "select exists(select 1 from cvs_job_experiences where cv_id= :cvId and candidate_job_exp_id = :candidateJobExperienceId)", nativeQuery = true)
    boolean existsCandidateJobExpInCv(@Param(value = "candidateJobExperienceId") Integer candidateJobExperienceId, @Param(value = "cvId") Integer cvId);

    @Query(value = "select exists(select 1 from cvs_languages where cv_id= :cvId and candidate_language_id = :candidateLanguageId)", nativeQuery = true)
    boolean existsCandidateLangInCv(@Param(value = "candidateLanguageId") Integer candidateLanguageId, @Param(value = "cvId") Integer cvId);

    @Query(value = "select exists(select 1 from cvs_schools where cv_id= :cvId and candidate_school_id = :candidateSchoolId)", nativeQuery = true)
    boolean existsCandidateSchoolInCv(@Param(value = "candidateSchoolId") Integer candidateSchoolId, @Param(value = "cvId") Integer cvId);

    @Query(value = "select exists(select 1 from cvs_skills where cv_id= :cvId and candidate_skill_id = :candidateSkillId)", nativeQuery = true)
    boolean existsCandidateSkillInCv(@Param(value = "candidateSkillId") Integer candidateSkillId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query("update Cv cv set cv.title = :title where cv.id = :id")
    void updateTitle(@Param(value = "title") String title, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Cv cv set cv.coverLetter = :coverLetter where cv.id = :id")
    void updateCoverLetter(@Param(value = "coverLetter") String coverLetter, @Param(value = "id") Integer id);

    @Modifying
    @Query(value = "INSERT INTO cvs_job_experiences VALUES (:cvId, :candidateJobExpId)", nativeQuery = true)
    void addJobExpToCv(@Param(value = "candidateJobExpId") Integer candidateJobExpId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "INSERT INTO cvs_languages VALUES (:cvId, :candidateLangId)", nativeQuery = true)
    void addLangToCv(@Param(value = "candidateLangId") Integer candidateLangId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "INSERT INTO cvs_schools VALUES (:cvId, :candidateSchoolId)", nativeQuery = true)
    void addSchoolToCv(@Param(value = "candidateSchoolId") Integer candidateSchoolId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "INSERT INTO cvs_skills VALUES (:cvId, :candidateSkillId)", nativeQuery = true)
    void addSkillToCv(@Param(value = "candidateSkillId") Integer candidateSkillId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "DELETE FROM cvs_job_experiences WHERE cv_id = :cvId AND candidate_job_exp_id = :candidateJobExpId", nativeQuery = true)
    void deleteJobExpFromCv(@Param(value = "candidateJobExpId") Integer candidateJobExpId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "DELETE FROM cvs_languages WHERE cv_id = :cvId AND candidate_language_id = :candidateLangId", nativeQuery = true)
    void deleteLangFromCv(@Param(value = "candidateLangId") Integer candidateLangId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "DELETE FROM cvs_schools WHERE cv_id = :cvId AND candidate_school_id = :candidateSchoolId", nativeQuery = true)
    void deleteSchoolFromCv(@Param(value = "candidateSchoolId") Integer candidateSchoolId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query(value = "DELETE FROM cvs_skills WHERE cv_id = :cvId AND candidate_skill_id = :candidateSkillId", nativeQuery = true)
    void deleteSkillFromCv(@Param(value = "candidateSkillId") Integer candidateSkillId, @Param(value = "cvId") Integer cvId);

    @Modifying
    @Query("update Cv cv set cv.lastModifiedAt = :lastModifiedAt where cv.id = :id")
    void updateLastModifiedAt(@Param(value = "lastModifiedAt") LocalDateTime lastModifiedAt, @Param(value = "id") Integer id);

}
