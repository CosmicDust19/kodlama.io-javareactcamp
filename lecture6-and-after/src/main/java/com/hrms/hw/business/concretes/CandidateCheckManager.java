package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CandidateCheckService;
import com.hrms.hw.entities.concretes.Candidate;
import org.springframework.stereotype.Service;

@Service
public class CandidateCheckManager implements CandidateCheckService {

    @Override
    public boolean areAllFieldsFilled(Candidate candidate) {
        return candidate.getId() != 0 && candidate.getEmail() != null && candidate.getPassword() != null && candidate.getFirstName() != null
                && candidate.getLastName() != null && candidate.getNationalityId() != null && candidate.getBirthYear() != 0;
    }

}
