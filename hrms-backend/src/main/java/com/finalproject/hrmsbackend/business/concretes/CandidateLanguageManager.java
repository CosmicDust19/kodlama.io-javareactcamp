package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateLanguageService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateLanguageDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.LanguageDao;
import com.finalproject.hrmsbackend.entities.concretes.CandidateLanguage;
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
    private final CheckService check;

    @Override
    public DataResult<List<CandidateLanguage>> getAll() {
        return new SuccessDataResult<>(candidateLanguageDao.findAll());
    }

    @Override
    public Result add(CandidateLanguageAddDto candidateLanguageAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(candidateDao, candidateLanguageAddDto.getCandidateId()))
            errors.put("candidateId", Msg.NOT_EXIST.get());
        if (check.notExistsById(languageDao, candidateLanguageAddDto.getLanguageId()))
            errors.put("languageId", Msg.NOT_EXIST.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(Msg.FAILED.get(), errors);

        CandidateLanguage candidateLanguage = modelMapper.map(candidateLanguageAddDto, CandidateLanguage.class);

        CandidateLanguage savedCandLang = candidateLanguageDao.save(candidateLanguage);
        return new SuccessDataResult<>(Msg.SAVED.get(), savedCandLang);
    }

    @Override
    public Result deleteById(int candLangId) {
        candidateLanguageDao.deleteById(candLangId);
        return new SuccessResult(Msg.DELETED.get());
    }

    @Override
    public Result updateLanguage(short languageId, int candLangId) {
        if (check.notExistsById(candidateLanguageDao, candLangId))
            return new ErrorResult(Msg.NOT_EXIST.get("candLangId"));
        if (check.notExistsById(languageDao, languageId))
            return new ErrorResult(Msg.NOT_EXIST.get("languageId"));

        CandidateLanguage candLang = candidateLanguageDao.getById(candLangId);
        candLang.setLanguage(languageDao.getById(languageId));
        CandidateLanguage savedCandLang = candidateLanguageDao.save(candLang);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandLang);
    }

    @Override
    public Result updateLangLevel(String languageLevel, int candLangId) {
        if (check.notExistsById(candidateLanguageDao, candLangId))
            return new ErrorResult(Msg.NOT_EXIST.get("candLangId"));

        CandidateLanguage candLang = candidateLanguageDao.getById(candLangId);
        candLang.setLanguageLevel(languageLevel);
        CandidateLanguage savedCandLang = candidateLanguageDao.save(candLang);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandLang);
    }

}
