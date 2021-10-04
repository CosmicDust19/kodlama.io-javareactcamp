package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateService;
import com.finalproject.hrmsbackend.business.abstracts.check.CandidateCheckService;
import com.finalproject.hrmsbackend.business.abstracts.check.JobAdvertisementCheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.business.abstracts.UserCheckService;
import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.ErrorDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateManager implements CandidateService {

    private final CandidateDao candidateDao;
    private final CandidateCheckService candidateCheck;
    private final CheckService check;
    private final UserCheckService userCheck;
    private final JobAdvertisementCheckService jobAdvertCheck;
    private final EmailService emailService;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<Boolean> existsByNatId(String nationalityId) {
        return new SuccessDataResult<>(candidateDao.existsByNationalityId(nationalityId));
    }

    @Override
    public DataResult<List<Candidate>> getAll() {
        return new SuccessDataResult<>(candidateDao.findAll());
    }

    @Override
    public DataResult<Candidate> getById(int candId) {
        candidateCheck.existsCandidateById(candId);
        return new SuccessDataResult<>(candidateDao.getById(candId));
    }

    @Override
    public DataResult<Candidate> getByEmailAndPW(String email, String password) {
        return new SuccessDataResult<>(candidateDao.getByEmailAndPassword(email, password));
    }

    @Override
    public Result add(CandidateAddDto candidateAddDto) {
        userCheck.notExistsUserByEmail(candidateAddDto.getEmail(), null);
        candidateCheck.realPerson(candidateAddDto);
        candidateCheck.notExistsCandidateByNatId(candidateAddDto.getNationalityId());
        ErrorDataResult<ApiError> errors = Utils.getErrorsIfExist(candidateCheck, userCheck);
        if (errors != null) return errors;

        Candidate candidate = modelMapper.map(candidateAddDto, Candidate.class);
        emailService.sendVerificationMail(candidate.getEmail());
        Candidate savedCandidate = candidateDao.save(candidate);
        savedCandidate.setPassword(null);
        return new SuccessDataResult<>(Msg.SAVED.get(), savedCandidate);
    }

    @Override
    public Result updateGithubAccount(String githubAccount, int candId) {
        candidateCheck.existsCandidateById(candId);
        Candidate candidate = candidateDao.getById(candId);
        check.notTheSame(candidate.getGithubAccount(), githubAccount, "Github account");
        candidate.setGithubAccount(githubAccount);
        return execLastUpdAct(candidate);
    }

    @Override
    public Result updateLinkedinAccount(String linkedinAccount, int candId) {
        candidateCheck.existsCandidateById(candId);
        Candidate candidate = candidateDao.getById(candId);
        check.notTheSame(candidate.getLinkedinAccount(), linkedinAccount, "Linkedin account");
        candidate.setLinkedinAccount(linkedinAccount);
        return execLastUpdAct(candidate);
    }

    @Override
    public Result updateFavoriteJobAdverts(int jobAdvertisementId, int candId, String updateType) {
        candidateCheck.existsCandidateById(candId);
        jobAdvertCheck.existsJobAdvertById(jobAdvertisementId);
        if (updateType.equals(Utils.UpdateType.DEL)) candidateDao.deleteJobAdvFromFavorites(jobAdvertisementId, candId);
        else candidateDao.addJobAdvToFavorites(jobAdvertisementId, candId);
        Candidate savedCand = candidateDao.getById(candId);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCand);
    }

    private Result execLastUpdAct(Candidate candidate) {
        candidate.setLastModifiedAt(LocalDateTime.now());
        Candidate savedCandidate = candidateDao.save(candidate);
        savedCandidate.setPassword(null);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandidate);
    }

}
