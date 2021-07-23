package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateJobExperienceAddDto;

import java.util.List;

public interface CandidateJobExperienceService {

    DataResult<List<CandidateJobExperience>> getAll();

    DataResult<List<CandidateJobExperience>> getByQuitYear(Short sortDirection);

    Result add(CandidateJobExperienceAddDto candidateJobExperienceAddDto);

    DataResult<Boolean> deleteById(int id);

    Result updateWorkPlace(String workPlace, int candJobExpId);

    Result updatePosition(short positionId, int candJobExpId);

    Result updateStartYear(short startYear, int candJobExpId);

    Result updateQuitYear(Short quitYear, int candJobExpId);

}
