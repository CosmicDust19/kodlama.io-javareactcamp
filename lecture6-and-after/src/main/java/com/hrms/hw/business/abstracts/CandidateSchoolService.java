package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.CandidateSchool;
import com.hrms.hw.entities.concretes.dtos.CandidateSchoolAddDto;

import java.util.List;

public interface CandidateSchoolService {
    DataResult<List<CandidateSchool>> getAll();

    DataResult<List<CandidateSchool>> getAllSortedDesc();

    Result add(CandidateSchoolAddDto candidateSchoolAddDto);
}
