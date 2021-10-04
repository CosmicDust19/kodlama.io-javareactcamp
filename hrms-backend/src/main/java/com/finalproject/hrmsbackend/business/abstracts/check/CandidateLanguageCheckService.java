package com.finalproject.hrmsbackend.business.abstracts.check;

import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateLanguageAddDto;

import java.util.Map;

public interface CandidateLanguageCheckService extends BaseCheckService {

    Map<String, String> getErrors();

    void existsCandidateLanguageById(Integer candLangId);

    void checkIfViolatesUk(CandidateLanguageAddDto candLangAddDto);

}
