package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.SoftwareKnowledge;

import java.util.List;

public interface SoftwareKnowledgeService {
    DataResult<List<SoftwareKnowledge>> getAll();

    Result add(SoftwareKnowledge softwareKnowledge);
}
