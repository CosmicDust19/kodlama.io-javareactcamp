package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSkillService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateSkillDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SkillDao;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSkill;
import com.finalproject.hrmsbackend.entities.concretes.Skill;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSkillAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CandidateSkillManager implements CandidateSkillService {

    private final CandidateSkillDao candidateSkillDao;
    private final CandidateDao candidateDao;
    private final SkillDao skillDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<CandidateSkill>> getAll() {
        return new SuccessDataResult<>("Success", candidateSkillDao.findAll());
    }

    @Override
    public Result add(CandidateSkillAddDto candidateSkillAddDto) {
        CandidateSkill candidateSkill = modelMapper.map(candidateSkillAddDto, CandidateSkill.class);

        Map<String, String> errors = new HashMap<>();
        if (!candidateDao.existsById(candidateSkill.getCandidate().getId()))
            errors.put("candidateId", "does not exist");
        if (candidateSkill.getSkill() == null) errors.put("skill", "null");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);

        Skill skill = candidateSkill.getSkill();
        skill.setName(Utils.formName(skill.getName()));
        if (skill.getId() <= 0  || !skillDao.existsById(skill.getId()))
            if(skill.getName() == null || skill.getName().length() == 0)
                return new ErrorResult("skill id or skill name should be given");
        if (!Utils.tryToSaveIfNotExists(skill, skillDao)){
            skill.setId(skillDao.getByName(skill.getName()).getId());
        }

        if (candidateSkillDao.existsByCandidateAndSkill(candidateSkill.getCandidate(), skill))
            return new ErrorResult("this candidate already have this skill");

        CandidateSkill savedCandidateSkill = candidateSkillDao.save(candidateSkill);
        return new SuccessResult(Integer.toString(savedCandidateSkill.getId()));
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        if (id <= 0 || !candidateSkillDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        candidateSkillDao.deleteById(id);
        return new SuccessDataResult<>("Success", true);
    }
}
