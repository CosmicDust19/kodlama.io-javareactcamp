package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSchool;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSchoolAddDto;

import java.util.List;

public interface CandidateSchoolService {

    DataResult<List<CandidateSchool>> getAll();

    DataResult<List<CandidateSchool>> getByGradYear(Short sortDirection);

    Result add(CandidateSchoolAddDto candidateSchoolAddDto);

    Result deleteById(int candSchId);

    Result updateSchool(int schoolId, int candSchId);

    Result updateDepartment(short departmentId, int candSchId);

    Result updateStartYear(short schoolStartYear, int candSchId);

    Result updateGradYear(Short graduationYear, int candSchId);

}
