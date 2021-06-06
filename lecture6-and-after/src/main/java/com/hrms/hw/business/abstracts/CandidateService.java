package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.business.UserService;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.Candidate;
import com.hrms.hw.entities.concretes.dtos.CandidateAddDto;

public interface CandidateService extends UserService<Candidate> {
    Result add(CandidateAddDto candidateAddDto);
}
