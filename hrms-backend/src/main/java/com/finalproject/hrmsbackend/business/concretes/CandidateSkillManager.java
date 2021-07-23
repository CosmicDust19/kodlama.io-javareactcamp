package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSkillService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
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
    public Result add(CandidateSkillAddDto candidateSkillAddDto) {
        if (check.notExistsById(candidateDao, candidateSkillAddDto.getCandidateId()))
            return new ErrorResult(MSGs.NOT_EXIST.get("candidateId"));
        if (check.notExistsById(skillDao, candidateSkillAddDto.getSkillId()))
            return new ErrorResult(MSGs.NOT_EXIST.get("skill.id"));

        CandidateSkill candidateSkill = modelMapper.map(candidateSkillAddDto, CandidateSkill.class);

        CandidateSkill savedCandidateSkill = candidateSkillDao.save(candidateSkill);
        return new SuccessDataResult<>(MSGs.SAVED.getCustom("%s (data: new id)"), savedCandidateSkill.getId());
    }

    @Override
    public Result deleteById(int candSkillId) {
        candidateSkillDao.deleteById(candSkillId);
        return new SuccessDataResult<>(MSGs.DELETED.get());
    }

}
