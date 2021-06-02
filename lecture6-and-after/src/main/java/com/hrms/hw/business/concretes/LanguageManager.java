package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.LanguageService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.LanguageDao;
import com.hrms.hw.entities.concretes.Language;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageManager implements LanguageService {

    private final LanguageDao languageDao;

    @Override
    public DataResult<List<Language>> getAll(){
        return new SuccessDataResult<>("Success", languageDao.findAll());
    }

    @Override
    public Result add(Language language){
        languageDao.save(language);
        return new SuccessResult("Success");
    }
}
