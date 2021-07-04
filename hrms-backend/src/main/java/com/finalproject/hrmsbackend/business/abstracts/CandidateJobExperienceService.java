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

    DataResult<Boolean> deleteById(int id);

    Result updateWorkPlace(String workPlace, int id);

    Result updatePosition(short positionId, int id);

    Result updateStartYear(short startYear, int id);

    Result updateQuitYear(Short quitYear, int id);
}
