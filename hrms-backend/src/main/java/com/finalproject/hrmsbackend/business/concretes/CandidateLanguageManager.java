package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateLanguageService;
import com.finalproject.hrmsbackend.core.business.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
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
    private final CheckService check;

    @Override
    public DataResult<List<CandidateLanguage>> getAll() {
        return new SuccessDataResult<>(candidateLanguageDao.findAll());
    }

    @Override
    public Result add(CandidateLanguageAddDto candidateLanguageAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(candidateDao, candidateLanguageAddDto.getCandidateId()))
            errors.put("candidateId", MSGs.NOT_EXIST.get());
        if (check.notExistsById(languageDao, candidateLanguageAddDto.getLanguage().getId()))
            errors.put("language.id", MSGs.NOT_EXIST.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        CandidateLanguage candidateLanguage = modelMapper.map(candidateLanguageAddDto, CandidateLanguage.class);

        CandidateLanguage savedCandidateLanguage = candidateLanguageDao.save(candidateLanguage);
        return new SuccessResult(Integer.toString(savedCandidateLanguage.getId()));
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        candidateLanguageDao.deleteById(id);
        return new SuccessDataResult<>(MSGs.DELETED.get(), true);
    }

    @Override
    public Result updateLanguage(short languageId, int id) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(candidateLanguageDao, id)) errors.put("id", MSGs.NOT_EXIST.get());
        if (check.notExistsById(languageDao, languageId)) errors.put("languageId", MSGs.NOT_EXIST.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        candidateLanguageDao.updateLanguage(new Language(languageId), id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateLangLevel(String languageLevel, int id) {
        if (check.notExistsById(candidateLanguageDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));
        candidateLanguageDao.updateLanguageLevel(languageLevel, id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

}
