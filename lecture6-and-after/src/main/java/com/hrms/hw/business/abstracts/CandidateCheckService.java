package com.hrms.hw.business.abstracts;

import com.hrms.hw.entities.concretes.Candidate;
import org.springframework.stereotype.Service;

@Service
public interface CandidateCheckService {

    boolean areAllFieldsFilled(Candidate candidate);
}
