package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.CandidateJobExperience;
import com.hrms.hw.entities.concretes.dtos.CandidateJobExperienceAddDto;

import java.util.List;

public interface CandidateJobExperienceService {
    DataResult<List<CandidateJobExperience>> getAll();

    DataResult<List<CandidateJobExperience>> getAllSortedDesc();

    Result add(CandidateJobExperienceAddDto candidateJobExperienceAddDto);
}
