package com.finalproject.hrmsbackend.business.concretes.check;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckManager;
import com.finalproject.hrmsbackend.business.abstracts.check.CandidateLanguageCheckService;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.EntityNotExistsException;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.UKViolationException;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateLanguageDao;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateLanguageAddDto;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidateLanguageCheckManager extends BaseCheckManager implements CandidateLanguageCheckService {

    private final CandidateLanguageDao candidateLanguageDao;

    @SneakyThrows
    @Override
    public void existsCandidateLanguageById(Integer candLangId) {
        if (CheckUtils.notExistsById(candidateLanguageDao, candLangId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("Candidate's language info"));
    }

    @SneakyThrows
    @Override
    public void checkIfViolatesUk(CandidateLanguageAddDto candLangAddDto) {
        if (candidateLanguageDao.existsByLanguage_IdAndCandidate_Id
                (candLangAddDto.getLanguageId(), candLangAddDto.getCandidateId()))
            throw new UKViolationException(Msg.UK_CAND_LANG.get());
    }
}
