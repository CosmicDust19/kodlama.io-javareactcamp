package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateLanguageService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.entities.ApiError;
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
    public Result add(CandidateLanguageAddDto candLangAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(candidateDao, candLangAddDto.getCandidateId()))
            errors.put("candidateId", Msg.NOT_EXIST.get("Candidate"));
        if (check.notExistsById(languageDao, candLangAddDto.getLanguageId()))
            errors.put("languageId", Msg.NOT_EXIST.get("Language"));
        if (violatesUk(candLangAddDto))
            errors.put("uk", Msg.UK_CAND_LANG.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(Msg.FAILED.get(), new ApiError(errors));

        CandidateLanguage candidateLanguage = modelMapper.map(candLangAddDto, CandidateLanguage.class);

        CandidateLanguage savedCandLang = candidateLanguageDao.save(candidateLanguage);
        savedCandLang.setLanguage(languageDao.getById(savedCandLang.getLanguage().getId()));
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
            return new ErrorResult(Msg.NOT_EXIST.get("Language"));

        CandidateLanguage candLang = candidateLanguageDao.getById(candLangId);
        if (candLang.getLanguage().getId() == languageId)
            return new ErrorResult(Msg.IS_THE_SAME.get("Language"));

        candLang.setLanguage(languageDao.getById(languageId));
        CandidateLanguage savedCandLang = candidateLanguageDao.save(candLang);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandLang);
    }

    @Override
    public Result updateLangLevel(String languageLevel, int candLangId) {
        if (check.notExistsById(candidateLanguageDao, candLangId))
            return new ErrorResult(Msg.NOT_EXIST.get("candLangId"));

        CandidateLanguage candLang = candidateLanguageDao.getById(candLangId);
        if (candLang.getLanguageLevel().equals(languageLevel))
            return new ErrorResult(Msg.IS_THE_SAME.get("Language level"));

        candLang.setLanguageLevel(languageLevel);
        CandidateLanguage savedCandLang = candidateLanguageDao.save(candLang);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandLang);
    }

    private boolean violatesUk(CandidateLanguageAddDto candLangAddDto) {
        return candidateLanguageDao.existsByLanguage_IdAndCandidate_Id
                (candLangAddDto.getLanguageId(), candLangAddDto.getCandidateId());
    }

}
