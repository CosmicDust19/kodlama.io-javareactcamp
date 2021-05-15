package com.hrms.lecture6hw2.business.concretes;

import com.hrms.lecture6hw2.business.abstracts.CandidateService;
import com.hrms.lecture6hw2.dataAccess.abstracts.CandidateDao;
import com.hrms.lecture6hw2.entities.concretes.Candidate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateManager implements CandidateService {

    private final CandidateDao candidateDao;

    @Autowired
    public CandidateManager(CandidateDao candidateDao) {
        this.candidateDao = candidateDao;
    }

    @Override
    public List<Candidate> getAll() {
        return candidateDao.findAll();
    }
}
