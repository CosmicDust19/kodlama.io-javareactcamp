package com.finalproject.hrmsbackend.business.concretes.check;

import com.finalproject.hrmsbackend.business.abstracts.check.BaseCheckManager;
import com.finalproject.hrmsbackend.business.abstracts.check.CandidateSkillCheckService;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.EntityNotExistsException;
import com.finalproject.hrmsbackend.core.utilities.exception.exceptions.UKViolationException;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateSkillDao;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSkillAddDto;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidateSkillCheckManager extends BaseCheckManager implements CandidateSkillCheckService {

    private final CandidateSkillDao candidateSkillDao;

    @SneakyThrows
    @Override
    public void existsCandidateSkillById(Integer candSkillId) {
        if (CheckUtils.notExistsById(candidateSkillDao, candSkillId))
            throw new EntityNotExistsException(Msg.NOT_EXIST.get("Candidate's skill info"));
    }

    @SneakyThrows
    @Override
    public void checkIfViolatesUk(CandidateSkillAddDto candSkillAddDto) {
        if (candidateSkillDao.existsBySkill_IdAndCandidate_Id
                (candSkillAddDto.getSkillId(), candSkillAddDto.getCandidateId()))
            throw new UKViolationException(Msg.UK_CAND_SKILL.get());
    }
}
