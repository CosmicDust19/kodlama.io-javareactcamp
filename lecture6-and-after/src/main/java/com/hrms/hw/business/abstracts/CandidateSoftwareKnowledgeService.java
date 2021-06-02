package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.CandidateSoftwareKnowledge;
import com.hrms.hw.entities.concretes.dtos.CandidateSoftwareKnowledgeAddDto;

import java.util.List;

public interface CandidateSoftwareKnowledgeService {
    DataResult<List<CandidateSoftwareKnowledge>> getAll();

    Result add(CandidateSoftwareKnowledgeAddDto candidateSoftwareKnowledgeAddDto);
}
