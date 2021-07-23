package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateService;
import com.finalproject.hrmsbackend.core.business.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.adapters.MernisServiceAdapter;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
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
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateManager implements CandidateService {

    private final CandidateDao candidateDao;
    private final UserDao userDao;
    private final MernisServiceAdapter mernisServiceAdapter;
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
        if (!mernisServiceAdapter.isRealPerson(candidateAddDto)) return new ErrorResult(MSGs.MERNIS_FAIL.get());

        Candidate candidate = modelMapper.map(candidateAddDto, Candidate.class);

        candidateDao.save(candidate);
        emailService.sendVerificationMail(candidateAddDto.getEmail());
        return new SuccessResult(MSGs.SAVED.get());
    }

    @Override
    public Result updateGithubAccount(String githubAccount, int candId) {
        if (check.notExistsById(candidateDao, candId)) return new ErrorResult(MSGs.NOT_EXIST.get("candId"));
        candidateDao.updateGithubAccount(githubAccount, candId);
        userDao.updateLastModifiedAt(LocalDateTime.now(), candId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateLinkedinAccount(String linkedinAccount, int candId) {
        if (check.notExistsById(candidateDao, candId)) return new ErrorResult(MSGs.NOT_EXIST.get("candId"));
        candidateDao.updateLinkedinAccount(linkedinAccount, candId);
        userDao.updateLastModifiedAt(LocalDateTime.now(), candId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateFavoriteJobAdverts(int jobAdvertisementId, int candId, String updateType) {
        if (check.notExistsById(candidateDao, candId))
            return new ErrorResult(MSGs.NOT_EXIST.get("candId"));
        if (check.notExistsById(jobAdvertisementDao, jobAdvertisementId))
            return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvertisementId"));

        if (updateType.equals(Utils.UpdateType.DEL)) candidateDao.deleteJobAdvFromFavorites(jobAdvertisementId, candId);
        else candidateDao.addJobAdvToFavorites(jobAdvertisementId, candId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

}
