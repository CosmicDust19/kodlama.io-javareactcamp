package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateLanguageService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateLanguageDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.LanguageDao;
import com.finalproject.hrmsbackend.entities.concretes.CandidateLanguage;
import com.finalproject.hrmsbackend.entities.concretes.Language;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateLanguageAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CandidateLanguageManager implements CandidateLanguageService {

    private final CandidateDao candidateDao;
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

        Map<String, String> errors = new HashMap<>();
        if (!candidateDao.existsById(candidateLanguage.getCandidate().getId()))
            errors.put("candidateId", "does not exist");
        if (candidateLanguage.getLanguage() == null) errors.put("language", "null");
        if (!errors.isEmpty()) return new ErrorDataResult<>("error", errors);

        Language language = candidateLanguage.getLanguage();
        language.setName(Utils.formName(language.getName()));
        if (language.getId() <= 0  || !languageDao.existsById(language.getId()))
            if(language.getName() == null || language.getName().length() == 0)
                return new ErrorResult("language id or language name should be given");
        if (!Utils.tryToSaveIfNotExists(language, languageDao))
            language.setId(languageDao.getByName(language.getName()).getId());

        if (candidateLanguageDao.existsByCandidateAndLanguage(candidateLanguage.getCandidate(), candidateLanguage.getLanguage()))
            return new ErrorResult("this candidate already have this language");

        CandidateLanguage savedCandidateLanguage = candidateLanguageDao.save(candidateLanguage);
        return new SuccessResult(Integer.toString(savedCandidateLanguage.getId()));
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        if (id <= 0 || !candidateLanguageDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        candidateLanguageDao.deleteById(id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateLanguage(short languageId, int id){
        Language language = new Language();
        language.setId(languageId);
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateLanguageDao.existsById(id))
            errors.put("candidateId", "does not exist");
        if (language.getId() <= 0 || !languageDao.existsById(language.getId()))
            errors.put("language", "does not exist");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);
        CandidateLanguage candidateLanguage = candidateLanguageDao.getById(id);
        if (candidateLanguage.getLanguage().getId() == languageId)
            return new ErrorResult("language is the same");
        if (candidateLanguageDao.existsByCandidateAndLanguage(candidateLanguage.getCandidate(), language))
            return new ErrorResult("the candidateLanguage that you want to create is already exists");
        candidateLanguageDao.updateLanguage(language, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateLanguageLevel(String languageLevel, int id){
        if (languageLevel != null) languageLevel = languageLevel.trim().toUpperCase();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateLanguageDao.existsById(id))
            errors.put("candidateId", "does not exist");
        if (languageLevel == null || !Pattern.matches("[ABC][12]", languageLevel))
            errors.put("languageLevel", "not a english level according to the common european framework (A1, A2 etc.)");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);
        candidateLanguageDao.updateLanguageLevel(languageLevel, id);
        return new SuccessResult("Success");
    }
}
