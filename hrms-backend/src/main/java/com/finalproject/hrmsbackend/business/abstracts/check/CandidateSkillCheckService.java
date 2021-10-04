package com.finalproject.hrmsbackend.business.abstracts.check;

import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSkillAddDto;

import java.util.Map;

public interface CandidateSkillCheckService extends BaseCheckService {

    Map<String, String> getErrors();

    void existsCandidateSkillById(Integer candSkillId);

    void checkIfViolatesUk(CandidateSkillAddDto candSkillAddDto);

}
