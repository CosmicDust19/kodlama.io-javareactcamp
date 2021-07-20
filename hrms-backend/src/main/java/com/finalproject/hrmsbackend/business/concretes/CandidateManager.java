package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateService;
import com.finalproject.hrmsbackend.core.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.adapters.MernisServiceAdapter;
import com.finalproject.hrmsbackend.core.business.CheckService;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public DataResult<Candidate> getById(int id) {
        return new SuccessDataResult<>(candidateDao.getById(id));
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
    public DataResult<Boolean> deleteById(int id) {
        candidateDao.deleteById(id);
        return new SuccessDataResult<>(MSGs.DELETED.get(), true);
    }

    @Override
    public Result updateGithubAccount(String githubAccount, int id) {
        if (check.notExistsById(candidateDao, id)) return new ErrorResult(MSGs.FAILED.get("id"));
        candidateDao.updateGithubAccount(githubAccount, id);
        userDao.updateLastModifiedAt(LocalDateTime.now(), id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateLinkedinAccount(String linkedinAccount, int id) {
        if (check.notExistsById(candidateDao, id)) return new ErrorResult(MSGs.FAILED.get("id"));
        candidateDao.updateLinkedinAccount(linkedinAccount, id);
        userDao.updateLastModifiedAt(LocalDateTime.now(), id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateFavoriteJobAdverts(int jobAdvertisementId, int id, String updateType) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(candidateDao, id)) errors.put("id", MSGs.NOT_EXIST.get());
        if (check.notExistsById(jobAdvertisementDao, id)) errors.put("jobAdvertisementId", MSGs.NOT_EXIST.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        if (updateType.equals(Utils.UpdateType.DEL)) candidateDao.deleteJobAdvFromFavorites(jobAdvertisementId, id);
        else candidateDao.addJobAdvToFavorites(jobAdvertisementId, id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

}
