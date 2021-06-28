package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateCv;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateCvAddDto;

import java.util.List;

public interface CandidateCvService {
    DataResult<List<CandidateCv>> getAll();

    DataResult<CandidateCv> getById(int id);

    Result add(CandidateCvAddDto candidateCvAddDto);

    DataResult<Boolean> deleteById(int id);

    DataResult<Boolean> updateCoverLetter(String coverLetter, int id);
}
