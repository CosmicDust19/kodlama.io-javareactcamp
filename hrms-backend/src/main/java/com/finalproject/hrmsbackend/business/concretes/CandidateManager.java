package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateService;
import com.finalproject.hrmsbackend.core.adapters.abstracts.MernisService;
import com.finalproject.hrmsbackend.core.business.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.JobAdvertisementDao;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CandidateManager implements CandidateService {

    private final UserDao userDao;
    private final CandidateDao candidateDao;
    private final MernisService mernisService;
    private final CheckService check;
    private final EmailService emailService;
    private final ModelMapper modelMapper;
    private final JobAdvertisementDao jobAdvertisementDao;

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
        return new SuccessDataResult<>(candidateDao.getById(candId));
    }

    @Override
    public DataResult<Candidate> getByEmailAndPW(String email, String password) {
        return new SuccessDataResult<>(candidateDao.getByEmailAndPassword(email, password));
    }

    @Override
    public Result add(CandidateAddDto candidateAddDto) {
        Map<String, String> errors = new LinkedHashMap<>();
        if (userDao.existsByEmail(candidateAddDto.getEmail()))
            errors.put("email", Msg.IS_IN_USE.get("Email"));
        if (!mernisService.realPerson(candidateAddDto))
            errors.put("mernis", Msg.MERNIS_FAIL.get());
        if (candidateDao.existsByNationalityId(candidateAddDto.getNationalityId()))
            errors.put("nationalityId", Msg.IS_IN_USE.get("Nationality ID"));
        if (!errors.isEmpty()) return new ErrorDataResult<>(Msg.FAILED.get(), new ApiError(errors));

        Candidate candidate = modelMapper.map(candidateAddDto, Candidate.class);
        return execLastAddAct(candidate);
    }

    @Override
    public Result updateGithubAccount(String githubAccount, int candId) {
        if (check.notExistsById(candidateDao, candId)) return new ErrorResult(Msg.NOT_EXIST.get("candId"));

        Candidate candidate = candidateDao.getById(candId);
        if (check.equals(candidate.getGithubAccount(), githubAccount))
            return new ErrorResult(Msg.IS_THE_SAME.get("Github account"));

        candidate.setGithubAccount(githubAccount);
        return execLastUpdAct(candidate);
    }

    @Override
    public Result updateLinkedinAccount(String linkedinAccount, int candId) {
        if (check.notExistsById(candidateDao, candId)) return new ErrorResult(Msg.NOT_EXIST.get("candId"));

        Candidate candidate = candidateDao.getById(candId);
        if (check.equals(candidate.getLinkedinAccount(), linkedinAccount))
            return new ErrorResult(Msg.IS_THE_SAME.get("Linkedin account"));

        candidate.setLinkedinAccount(linkedinAccount);
        return execLastUpdAct(candidate);
    }

    @Override
    public Result updateFavoriteJobAdverts(int jobAdvertisementId, int candId, String updateType) {
        if (check.notExistsById(candidateDao, candId))
            return new ErrorResult(Msg.NOT_EXIST.get("candId"));
        if (check.notExistsById(jobAdvertisementDao, jobAdvertisementId))
            return new ErrorResult(Msg.NOT_EXIST.get("Job advertisement"));

        if (updateType.equals(Utils.UpdateType.DEL)) candidateDao.deleteJobAdvFromFavorites(jobAdvertisementId, candId);
        else candidateDao.addJobAdvToFavorites(jobAdvertisementId, candId);
        Candidate savedCand = candidateDao.getById(candId);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCand);
    }

    private Result execLastUpdAct(Candidate candidate) {
        candidate.setLastModifiedAt(LocalDateTime.now());
        Candidate savedCand = candidateDao.save(candidate);
        savedCand.setPassword(null);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCand);
    }

    private Result execLastAddAct(Candidate candidate) {
        Candidate savedCandidate = candidateDao.save(candidate);
        emailService.sendVerificationMail(savedCandidate.getEmail());
        savedCandidate.setCvs(new ArrayList<>());
        savedCandidate.setCandidateJobExperiences(new ArrayList<>());
        savedCandidate.setCandidateSchools(new ArrayList<>());
        savedCandidate.setCandidateLanguages(new ArrayList<>());
        savedCandidate.setCandidateSkills(new ArrayList<>());
        savedCandidate.setFavoriteJobAdvertisements(new ArrayList<>());
        return new SuccessDataResult<>(Msg.SAVED.get(), savedCandidate);
    }

}
