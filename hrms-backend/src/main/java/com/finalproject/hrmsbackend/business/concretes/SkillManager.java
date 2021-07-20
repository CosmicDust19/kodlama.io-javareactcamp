package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.SkillService;
import com.finalproject.hrmsbackend.core.business.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SkillDao;
import com.finalproject.hrmsbackend.entities.concretes.Skill;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillManager implements SkillService {

    private final SkillDao skillDao;
    private final CheckService check;

    @Override
    public DataResult<List<Skill>> getAll() {
        return new SuccessDataResult<>(skillDao.findAll());
    }

    @Override
    public Result add(Skill skill) {
        if (skill.getName() != null) skill.setName(skill.getName().trim());
        if (check.invalidLength(skill.getName(), 0, 100)) return new ErrorResult(MSGs.INVALID.get("skillName"));
        skillDao.save(skill);
        return new SuccessResult(MSGs.SAVED.get());
    }
}
