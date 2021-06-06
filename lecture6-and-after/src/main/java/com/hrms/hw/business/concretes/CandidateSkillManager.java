package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CandidateSkillService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.CandidateSkillDao;
import com.hrms.hw.entities.concretes.CandidateSkill;
import com.hrms.hw.entities.concretes.dtos.CandidateSkillAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateSkillManager implements CandidateSkillService {

    private final CandidateSkillDao candidateSkillDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<CandidateSkill>> getAll() {
        return new SuccessDataResult<>("Success", candidateSkillDao.findAll());
    }

    @Override
    public Result add(CandidateSkillAddDto candidateSkillAddDto) {
        CandidateSkill candidateSkill = modelMapper.map(candidateSkillAddDto, CandidateSkill.class);
        candidateSkillDao.save(candidateSkill);
        return new SuccessResult("Success");
    }
}