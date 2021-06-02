package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.SoftwareKnowledgeService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.SoftwareKnowledgeDao;
import com.hrms.hw.entities.concretes.SoftwareKnowledge;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SoftwareKnowledgeManager implements SoftwareKnowledgeService {

    private final SoftwareKnowledgeDao softwareKnowledgeDao;

    @Override
    public DataResult<List<SoftwareKnowledge>> getAll() {
        return new SuccessDataResult<>("Success", softwareKnowledgeDao.findAll());
    }

    @Override
    public Result add(SoftwareKnowledge softwareKnowledge) {
        softwareKnowledgeDao.save(softwareKnowledge);
        return new SuccessResult("Success");
    }
}
