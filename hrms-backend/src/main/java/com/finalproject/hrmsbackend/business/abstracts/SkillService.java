package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Skill;

import java.util.List;

public interface SkillService {

    DataResult<List<Skill>> getAll();

    Result add(String skillName);

}
