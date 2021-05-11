package com.hrms.lecture6hw2.business.abstracts;

import com.hrms.lecture6hw2.entities.concretes.Candidate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CandidateService {
    List<Candidate> getAll();
}
