package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.business.UserService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;

public interface CandidateService extends UserService<Candidate> {

    DataResult<Boolean> existsByEmailAndPassword(String email, String password);

    DataResult<Boolean> existsByNationalityId(String nationalityId);

    DataResult<Candidate> getById(int id);

    DataResult<Candidate> getByEmailAndPassword(String email, String password);

    Result add(CandidateAddDto candidateAddDto);

}
