package com.finalproject.hrmsbackend.business.abstracts.check;

import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSchoolAddDto;

import java.util.Map;

public interface CandidateSchoolCheckService extends BaseCheckService {

    Map<String, String> getErrors();

    void existsCandidateSchoolById(Integer candSchId);

    void checkIfViolatesUk(CandidateSchoolAddDto candSchAddDto);

}
