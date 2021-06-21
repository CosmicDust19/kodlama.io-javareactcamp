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
        if (candidateLanguage.getLanguage() == null || (candidateLanguage.getLanguage().getId() == 0 && candidateLanguage.getLanguage().getName() == null))
            errors.put("languageId", "language id or language name should be given");
        if (!errors.isEmpty()) return new ErrorDataResult<>("error", errors);

        Language language = candidateLanguage.getLanguage();
        language.setName(Utils.formName(language.getName()));
        if (!Utils.tryToSaveIfNotExists(language, languageDao))
            language.setId(languageDao.getByName(language.getName()).getId());

        if (candidateLanguageDao.existsByCandidateAndLanguage(candidateLanguage.getCandidate(), candidateLanguage.getLanguage()))
            return new ErrorDataResult<>("unique key", "candidate and language is used together before");

        try {
            candidateLanguageDao.save(candidateLanguage);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            return new ErrorResult("an unknown error has occurred");
        }
        return new SuccessResult("Success");
    }

}
