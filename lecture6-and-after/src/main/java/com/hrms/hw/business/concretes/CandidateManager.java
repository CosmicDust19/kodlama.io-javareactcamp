package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CandidateService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.CandidateDao;
import com.hrms.hw.entities.concretes.Candidate;
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
    public DataResult<List<Candidate>> getAll() {
        return new SuccessDataResult<>("Success", candidateDao.findAll());
    }

    public Result add(Candidate candidate){
        candidateDao.save(candidate);
        return new SuccessResult("Candidate Saved");
    }
}
