package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSchool;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSchoolAddDto;

import java.util.List;

public interface CandidateSchoolService {
    DataResult<List<CandidateSchool>> getAll();

    DataResult<List<CandidateSchool>> getAllSortedDesc();

    Result add(CandidateSchoolAddDto candidateSchoolAddDto);

    DataResult<Boolean> deleteById(int id);

    Result updateSchool(int schoolId, int id);

    Result updateDepartment(short departmentId, int id);

    Result updateStartYear(short schoolStartYear, int id);

    Result updateGraduationYear(Short graduationYear, int id);
}
