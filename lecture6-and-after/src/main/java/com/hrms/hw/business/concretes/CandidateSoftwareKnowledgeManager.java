package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CandidateSoftwareKnowledgeService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.CandidateSoftwareKnowledgeDao;
import com.hrms.hw.entities.concretes.CandidateSoftwareKnowledge;
import com.hrms.hw.entities.concretes.dtos.CandidateSoftwareKnowledgeAddDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateSoftwareKnowledgeManager implements CandidateSoftwareKnowledgeService {

    private final CandidateSoftwareKnowledgeDao candidateSoftwareKnowledgeDao;

    @Override
    public DataResult<List<CandidateSoftwareKnowledge>> getAll() {
        return new SuccessDataResult<>("Success", candidateSoftwareKnowledgeDao.findAll());
    }

    @Override
    public Result add(CandidateSoftwareKnowledgeAddDto candidateSoftwareKnowledgeAddDto) {
        CandidateSoftwareKnowledge candidateSoftwareKnowledge = new CandidateSoftwareKnowledge
                (candidateSoftwareKnowledgeAddDto.getCandidateId(), candidateSoftwareKnowledgeAddDto.getSoftwareKnowledgeId());
        candidateSoftwareKnowledgeDao.save(candidateSoftwareKnowledge);
        return new SuccessResult("Success");
    }
}
