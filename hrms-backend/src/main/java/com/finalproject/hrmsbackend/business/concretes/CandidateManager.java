package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateService;
import com.finalproject.hrmsbackend.core.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.adapters.MernisServiceAdapter;
import com.finalproject.hrmsbackend.core.dataAccess.UserDao;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.JobAdvertisementDao;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CandidateManager implements CandidateService {

    private final CandidateDao candidateDao;
    private final MernisServiceAdapter mernisServiceAdapter;
    private final EmailService emailService;
    private final ModelMapper modelMapper;
    private final UserDao userDao;
    private final JobAdvertisementDao jobAdvertisementDao;

    @Override
    public DataResult<List<Candidate>> getAll() {
        return new SuccessDataResult<>("Success", candidateDao.findAll());
    }

    @Override
    public DataResult<Boolean> existsByEmailAndPassword(String email, String password) {
        return new SuccessDataResult<>("Success", candidateDao.existsByEmailAndPassword(email, password));
    }

    @Override
    public DataResult<Boolean> existsByEmail(String email) {
        return new SuccessDataResult<>("Success", candidateDao.existsByEmail(email));
    }

    @Override
    public DataResult<Boolean> existsByNationalityId(String nationalityId) {
        return new SuccessDataResult<>("Success", candidateDao.existsByNationalityId(nationalityId));
    }

    @Override
    public DataResult<Candidate> getById(int id) {
        if (id <= 0 || !candidateDao.existsById(id)) {
            return new ErrorDataResult<>("id does not exist");
        }
        return new SuccessDataResult<>("Success", candidateDao.getById(id));
    }

    @Override
    public DataResult<Candidate> getByEmailAndPassword(String email, String password) {
        return new SuccessDataResult<>("Success", candidateDao.getByEmailAndPassword(email, password));
    }

    @Override
    public Result add(CandidateAddDto candidateAddDto) {
        if (!mernisServiceAdapter.isRealPerson(candidateAddDto.getNationalityId(),
                candidateAddDto.getFirstName(), candidateAddDto.getLastName(), candidateAddDto.getBirthYear()))
            return new ErrorResult("mernis verification failed");
        Candidate candidate = modelMapper.map(candidateAddDto, Candidate.class);
        emailService.sendVerificationMail(candidateAddDto.getEmail());
        candidateDao.save(candidate);
        return new SuccessResult("Email verified...  Candidate Saved.");
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        if (id <= 0 || !candidateDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        candidateDao.deleteById(id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateEmail(String email, int id) {
        if (email != null) email = email.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateDao.existsById(id))
            errors.put("id", "does not exist");
        if (email == null || email.length() < 4 || email.length() > 100 ||
                !Pattern.matches("^\\w+(\\.\\w+)*@[a-zA-Z]+(\\.\\w{2,6})+$", email))
            errors.put("email", "invalid email");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        if (userDao.existsByEmail(email))
            return new ErrorResult("email in use");
        candidateDao.updateEmail(email, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updatePassword(String password, String oldPassword, int id) {
        if (password != null) password = password.trim();
        Map<String, String> errors = new HashMap<>();
        if (!userDao.existsByIdAndPassword(id, oldPassword))
            errors.put("oldPassword", "wrong");
        if (id <= 0 || !candidateDao.existsById(id))
            errors.put("id", "does not exist");
        if (password == null || password.length() < 6 || password.length() > 20)
            errors.put("password", "should be a text between 6 and 20 long");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        candidateDao.updatePassword(password, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateGithubAccountLink(String githubAccountLink, int id) {
        if (githubAccountLink != null) githubAccountLink = githubAccountLink.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateDao.existsById(id))
            errors.put("id", "does not exist");
        if (githubAccountLink != null && githubAccountLink.length() < 4)
            errors.put("githubAccountLink", "invalid githubAccountLink");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        candidateDao.updateGithubAccountLink(githubAccountLink, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateLinkedinAccountLink(String linkedinAccountLink, int id) {
        if (linkedinAccountLink != null) linkedinAccountLink = linkedinAccountLink.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateDao.existsById(id))
            errors.put("id", "does not exist");
        if (linkedinAccountLink != null && linkedinAccountLink.length() < 4)
            errors.put("linkedinAccountLink", "invalid linkedinAccountLink");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        candidateDao.updateLinkedinAccountLink(linkedinAccountLink, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result addJobAdvertisementToFavorites(int jobAdvertisementId, int id) {
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateDao.existsById(id))
            errors.put("id", "does not exist");
        if (id <= 0 || !jobAdvertisementDao.existsById(jobAdvertisementId))
            errors.put("jobAdvertisementId", "does not exist");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        if (candidateDao.existsFavoriteCandidateJobAdvertisement(jobAdvertisementId, id))
            return new ErrorResult("This favorite jobAd already exists");
        candidateDao.addJobAdvertisementToCandidateFavorites(jobAdvertisementId, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result deleteJobAdvertisementFromFavorites(int jobAdvertisementId, int id) {
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateDao.existsById(id))
            errors.put("id", "does not exist");
        if (id <= 0 || !jobAdvertisementDao.existsById(jobAdvertisementId))
            errors.put("jobAdvertisementId", "does not exist");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        if (!candidateDao.existsFavoriteCandidateJobAdvertisement(jobAdvertisementId, id))
            return new ErrorResult("This favorite jobAd does not exists");
        candidateDao.deleteJobExperienceFromCandidateCv(jobAdvertisementId, id);
        return new SuccessResult("Success");
    }

}
