package com.finalproject.hrmsbackend.dataAccess.abstracts;

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

    boolean existsBySchool_IdAndDepartment_IdAndCandidate_Id(Integer schoolId, Short departmentId, Integer candidateId);

    @Modifying
    @Query("update CandidateSchool cSc set cSc.school = :school where cSc.id = :id")
    void updateSchool(@Param(value = "school") School school, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateSchool cSc set cSc.department = :department where cSc.id = :id")
    void updateDepartment(@Param(value = "department") Department department, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateSchool cSc set cSc.startYear = :startYear where cSc.id = :id")
    void updateStartYear(@Param(value = "startYear") Short startYear, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateSchool cSc set cSc.graduationYear = :graduationYear where cSc.id = :id")
    void updateGraduationYear(@Param(value = "graduationYear") Short graduationYear, @Param(value = "id") Integer id);

}
