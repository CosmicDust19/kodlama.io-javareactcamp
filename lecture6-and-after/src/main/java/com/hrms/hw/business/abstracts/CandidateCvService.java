package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.CandidateCv;
import com.hrms.hw.entities.concretes.dtos.CandidateCvAddDto;

import java.util.List;

public interface CandidateCvService {
    DataResult<List<CandidateCv>> getAll();

    Result add(CandidateCvAddDto candidateCvAddDto);
}
