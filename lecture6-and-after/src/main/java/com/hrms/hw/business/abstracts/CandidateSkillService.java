package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.CandidateSkill;
import com.hrms.hw.entities.concretes.dtos.CandidateSkillAddDto;

import java.util.List;

public interface CandidateSkillService {
    DataResult<List<CandidateSkill>> getAll();

    Result add(CandidateSkillAddDto candidateSkillAddDto);
}
