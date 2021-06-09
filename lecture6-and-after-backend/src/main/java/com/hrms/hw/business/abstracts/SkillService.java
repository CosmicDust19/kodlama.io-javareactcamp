package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.Skill;

import java.util.List;

public interface SkillService {
    DataResult<List<Skill>> getAll();

    Result add(Skill skill);
}
