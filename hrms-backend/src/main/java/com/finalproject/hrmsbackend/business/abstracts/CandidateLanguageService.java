package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateLanguage;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateLanguageAddDto;

import java.util.List;

public interface CandidateLanguageService {

    DataResult<List<CandidateLanguage>> getAll();

    Result add(CandidateLanguageAddDto candidateLanguageAddDto);

    Result deleteById(int candLangId);

    Result updateLanguage(short languageId, int candLangId);

    Result updateLangLevel(String languageLevel, int candLangId);

}
