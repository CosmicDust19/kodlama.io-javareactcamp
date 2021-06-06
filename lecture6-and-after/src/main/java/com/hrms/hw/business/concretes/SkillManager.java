package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.SkillService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.SkillDao;
import com.hrms.hw.entities.concretes.Skill;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillManager implements SkillService {

    private final SkillDao skillDao;

    @Override
    public DataResult<List<Skill>> getAll() {
        return new SuccessDataResult<>("Success", skillDao.findAll());
    }

    @Override
    public Result add(Skill skill) {
        skillDao.save(skill);
        return new SuccessResult("Success");
    }
}
