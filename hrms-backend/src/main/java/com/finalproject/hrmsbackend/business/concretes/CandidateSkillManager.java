package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSkillService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateSkillDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SkillDao;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSkill;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSkillAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateSkillManager implements CandidateSkillService {

    private final CandidateSkillDao candidateSkillDao;
    private final CandidateDao candidateDao;
    private final SkillDao skillDao;
    private final ModelMapper modelMapper;
    private final CheckService check;

    @Override
    public DataResult<List<CandidateSkill>> getAll() {
        return new SuccessDataResult<>(candidateSkillDao.findAll());
    }

    @Override
    public Result add(CandidateSkillAddDto candSkillAddDto) {
        if (check.notExistsById(candidateDao, candSkillAddDto.getCandidateId()))
            return new ErrorResult(Msg.NOT_EXIST.get("candidateId"));
        if (check.notExistsById(skillDao, candSkillAddDto.getSkillId()))
            return new ErrorResult(Msg.NOT_EXIST.get("skillId"));
        if (violatesUk(candSkillAddDto))
            return new ErrorResult(Msg.UK_CAND_SKILL.get());

        CandidateSkill candidateSkill = modelMapper.map(candSkillAddDto, CandidateSkill.class);

        CandidateSkill savedCandSkill = candidateSkillDao.save(candidateSkill);
        return new SuccessDataResult<>(Msg.SAVED.get(), savedCandSkill);
    }

    @Override
    public Result deleteById(int candSkillId) {
        candidateSkillDao.deleteById(candSkillId);
        return new SuccessResult(Msg.DELETED.get());
    }

    private boolean violatesUk(CandidateSkillAddDto candSkillAddDto) {
        return candidateSkillDao.existsBySkill_IdAndCandidate_Id
                (candSkillAddDto.getSkillId(), candSkillAddDto.getCandidateId());
    }

}
