package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Language;

import java.util.List;

public interface LanguageService {

    DataResult<List<Language>> getAll();

    Result add(String languageName);

}
