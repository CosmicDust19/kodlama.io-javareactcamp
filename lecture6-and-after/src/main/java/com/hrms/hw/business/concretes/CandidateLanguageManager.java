package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CandidateLanguageService;
import com.hrms.hw.core.utilities.Utils;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.CandidateLanguageDao;
import com.hrms.hw.dataAccess.abstracts.LanguageDao;
import com.hrms.hw.entities.concretes.CandidateLanguage;
import com.hrms.hw.entities.concretes.Language;
import com.hrms.hw.entities.concretes.dtos.CandidateLanguageAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateLanguageManager implements CandidateLanguageService {

    private final CandidateLanguageDao candidateLanguageDao;
    private final LanguageDao languageDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<CandidateLanguage>> getAll() {
        return new SuccessDataResult<>("Success", candidateLanguageDao.findAll());
    }

    @Override
    public Result add(CandidateLanguageAddDto candidateLanguageAddDto) {
        CandidateLanguage candidateLanguage = modelMapper.map(candidateLanguageAddDto, CandidateLanguage.class);

        Language language = candidateLanguage.getLanguage();
        language.setName(Utils.formName(language.getName()));
        if (!Utils.tryToSaveIfNotExists(language, languageDao)){
            //situation: we have a wrong id and the given language name exists in the database
            language.setId(languageDao.getByName(language.getName()).getId());
        }

        candidateLanguageDao.save(candidateLanguage);
        return new SuccessResult("Success");
    }

}
