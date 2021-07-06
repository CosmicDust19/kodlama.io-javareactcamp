package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.business.UserService;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;

public interface CandidateService extends UserService<Candidate> {

    DataResult<Boolean> existsByEmailAndPassword(String email, String password);

    DataResult<Boolean> existsByNationalityId(String nationalityId);

    DataResult<Candidate> getById(int id);

    DataResult<Candidate> getByEmailAndPassword(String email, String password);

    Result add(CandidateAddDto candidateAddDto);

    DataResult<Boolean> deleteById(int id);

    Result updateEmail(String email, int id);

    Result updatePassword(String password, String oldPassword, int id);

    Result updateGithubAccountLink(String githubAccountLink, int id);

    Result updateLinkedinAccountLink(String linkedinAccountLink, int id);

    Result addJobAdvertisementToFavorites(int jobAdvertisementId, int id);

    Result deleteJobAdvertisementFromFavorites(int jobAdvertisementId, int id);
}
