package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;

import java.util.List;

public interface CandidateService {

    DataResult<List<Candidate>> getAll();

    DataResult<Boolean> existsByNatId(String nationalityId);

    DataResult<Candidate> getById(int id);

    DataResult<Candidate> getByEmailAndPW(String email, String password);

    Result add(CandidateAddDto candidateAddDto);

    Result updateGithubAccount(String githubAccountLink, int id);

    Result updateLinkedinAccount(String linkedinAccountLink, int id);

    Result updateFavoriteJobAdverts(int jobAdvertisementId, int id, String type);

}
