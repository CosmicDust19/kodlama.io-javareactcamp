package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSkillService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.entities.ApiError;
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

import java.util.*;

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
    public DataResult<?> add(CandidateSkillAddDto candSkillAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(candidateDao, candSkillAddDto.getCandidateId()))
            errors.put("candidateId", Msg.NOT_EXIST.get("Candidate"));
        if (check.notExistsById(skillDao, candSkillAddDto.getSkillId()))
            errors.put("skillId", Msg.NOT_EXIST.get("Skill"));
        if (violatesUk(candSkillAddDto))
            errors.put("uk", Msg.UK_CAND_SKILL.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(Msg.FAILED.get(), new ApiError(errors));

        CandidateSkill candidateSkill = modelMapper.map(candSkillAddDto, CandidateSkill.class);

        CandidateSkill savedCandSkill = candidateSkillDao.save(candidateSkill);
        savedCandSkill.setSkill(skillDao.getById(savedCandSkill.getSkill().getId()));
        return new SuccessDataResult<>(Msg.SAVED.get(), savedCandSkill);
    }

    @Override
    public Result addMultiple(List<CandidateSkillAddDto> candSkillAddDtoList) {
        Map<String, Object> errors = new LinkedHashMap<>();
        List<Object> savedCandSkills = new ArrayList<>();
        short failed = 0;
        for (int i = 0; i < candSkillAddDtoList.size(); i++) {
            DataResult<?> result = add(candSkillAddDtoList.get(i));
            if (!result.isSuccess()) {
                errors.put(String.format("Skill[%d]", i), result);
                failed++;
            } else savedCandSkills.add(result.getData());
        }
        if (failed > 0) return new ErrorDataResult<>(Msg.FAILED.get(), new ApiError(errors));
        return new SuccessDataResult<>(Msg.SAVED.get(), savedCandSkills);
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
