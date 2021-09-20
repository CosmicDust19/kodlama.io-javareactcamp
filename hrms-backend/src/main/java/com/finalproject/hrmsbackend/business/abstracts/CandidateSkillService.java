package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSkill;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSkillAddDto;

import java.util.List;

public interface CandidateSkillService {

    DataResult<List<CandidateSkill>> getAll();

    Result add(CandidateSkillAddDto candidateSkillAddDto);

    Result addMultiple(List<CandidateSkillAddDto> candSkillAddDtoList);

    Result deleteById(int candSkillId);

}
