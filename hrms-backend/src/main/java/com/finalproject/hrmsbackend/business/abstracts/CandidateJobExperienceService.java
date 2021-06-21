package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateJobExperienceAddDto;

import java.util.List;

public interface CandidateJobExperienceService {
    DataResult<List<CandidateJobExperience>> getAll();

    DataResult<List<CandidateJobExperience>> getAllSortedDesc();

    Result add(CandidateJobExperienceAddDto candidateJobExperienceAddDto);
}
