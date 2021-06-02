package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.CandidateLanguage;
import com.hrms.hw.entities.concretes.dtos.CandidateLanguageAddDto;

import java.util.List;

public interface CandidateLanguageService {
    DataResult<List<CandidateLanguage>> getAll();

    Result add(CandidateLanguageAddDto candidateLanguageAddDto);
}
