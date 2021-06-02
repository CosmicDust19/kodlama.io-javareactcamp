package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.Language;

import java.util.List;

public interface LanguageService {
    DataResult<List<Language>> getAll();

    Result add(Language language);
}
