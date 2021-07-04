package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSchool;
import com.finalproject.hrmsbackend.entities.concretes.Department;
import com.finalproject.hrmsbackend.entities.concretes.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface CandidateSchoolDao extends JpaRepository<CandidateSchool, Integer> {
    boolean existsByCandidateAndSchoolAndDepartment(Candidate candidate, School school, Department department);

    CandidateSchool getByCandidateAndSchoolAndDepartment(Candidate candidate, School school, Department department);

    @Modifying
    @Query("update CandidateSchool candidateSchool set candidateSchool.school = :school where candidateSchool.id = :id")
    void updateSchool(@Param(value = "school") School school, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateSchool candidateSchool set candidateSchool.department = :department where candidateSchool.id = :id")
    void updateDepartment(@Param(value = "department") Department department, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateSchool candidateSchool set candidateSchool.schoolStartYear = :schoolStartYear where candidateSchool.id = :id")
    void updateStartYear(@Param(value = "schoolStartYear") Short schoolStartYear, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateSchool candidateSchool set candidateSchool.graduationYear = :graduationYear where candidateSchool.id = :id")
    void updateGraduationYear(@Param(value = "graduationYear") Short graduationYear, @Param(value = "id") Integer id);

}
