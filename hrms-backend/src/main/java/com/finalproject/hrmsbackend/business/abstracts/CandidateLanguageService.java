package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateLanguage;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateLanguageAddDto;

import java.util.List;

public interface CandidateLanguageService {
    DataResult<List<CandidateLanguage>> getAll();

    Result add(CandidateLanguageAddDto candidateLanguageAddDto);

    DataResult<Boolean> deleteById(int id);

    Result updateLanguage(short languageId, int id);

    Result updateLanguageLevel(String languageLevel, int id);
}
