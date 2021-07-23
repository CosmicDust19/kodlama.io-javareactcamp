package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.LanguageService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.LanguageDao;
import com.finalproject.hrmsbackend.entities.concretes.Language;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageManager implements LanguageService {

    private final LanguageDao languageDao;
    private final CheckService check;

    @Override
    public DataResult<List<Language>> getAll() {
        return new SuccessDataResult<>(languageDao.findAll());
    }

    @Override
    public Result add(String languageName) {
        languageDao.save(new Language(languageName));
        return new SuccessResult(MSGs.SAVED.get());
    }

}
