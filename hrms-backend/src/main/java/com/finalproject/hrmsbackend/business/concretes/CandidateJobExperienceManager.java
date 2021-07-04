package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateJobExperienceService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateJobExperienceDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.PositionDao;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
import com.finalproject.hrmsbackend.entities.concretes.Position;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateJobExperienceAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CandidateJobExperienceManager implements CandidateJobExperienceService {

    private final CandidateDao candidateDao;
    private final CandidateJobExperienceDao candidateJobExperienceDao;
    private final PositionDao positionDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<CandidateJobExperience>> getAll() {
        return new SuccessDataResult<>("Success", candidateJobExperienceDao.findAll());
    }

    @Override
    public DataResult<List<CandidateJobExperience>> getAllSortedDesc() {
        Sort sort = Sort.by(Sort.Direction.DESC, "quitYear");
        return new SuccessDataResult<>("Success", candidateJobExperienceDao.findAll(sort));
    }

    @Override
    public Result add(CandidateJobExperienceAddDto candidateJobExperienceAddDto) {
        CandidateJobExperience candidateJobExperience = modelMapper.map(candidateJobExperienceAddDto, CandidateJobExperience.class);

        Map<String, String> errors = new HashMap<>();
        if (!candidateDao.existsById(candidateJobExperience.getCandidate().getId()))
            errors.put("candidateId", "does not exist");
        if (candidateJobExperienceAddDto.getQuitYear() != null && candidateJobExperience.getStartYear() > candidateJobExperienceAddDto.getQuitYear())
            errors.put("startYear - quitYear", "the quit year cannot be a date before the start year");
        if (candidateJobExperience.getWorkPlace() == null || candidateJobExperience.getWorkPlace().length() == 0)
            errors.put("workPlace", "cannot be empty");
        if (candidateJobExperience.getPosition() == null) errors.put("position", "null");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);

        Position position = candidateJobExperience.getPosition();
        position.setTitle(Utils.formName(position.getTitle()));
        if (position.getId() <= 0  || !positionDao.existsById(position.getId()))
            if(position.getTitle() == null || position.getTitle().length() == 0)
                return new ErrorResult("position id or position title should be given");
        if (!Utils.tryToSaveIfNotExists(position, positionDao))
            position.setId(positionDao.getByTitle(position.getTitle()).getId());

        if (candidateJobExperienceDao.existsByCandidateAndWorkPlaceAndPosition(candidateJobExperience.getCandidate(), candidateJobExperience.getWorkPlace(), candidateJobExperience.getPosition()))
            return new ErrorResult("candidate, workplace and position is used together before");

        CandidateJobExperience savedCandidateJobExperience = candidateJobExperienceDao.save(candidateJobExperience);
        return new SuccessResult(Integer.toString(savedCandidateJobExperience.getId()));
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        if (id <= 0 || !candidateJobExperienceDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        candidateJobExperienceDao.deleteById(id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateWorkPlace(String workPlace, int id) {
        if (workPlace != null) workPlace = workPlace.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateJobExperienceDao.existsById(id))
            errors.put("candidateJobExperienceId", "does not exist");
        if (workPlace == null || workPlace.equals(""))
            errors.put("workPlace", "work place cannot be empty");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);
        CandidateJobExperience candidateJobExperience = candidateJobExperienceDao.getById(id);
        if (candidateJobExperience.getWorkPlace().equals(workPlace))
            return new ErrorResult("workPlace is the same");
        Candidate candidate = candidateJobExperience.getCandidate();
        Position position = candidateJobExperience.getPosition();
        if (candidateJobExperienceDao.existsByCandidateAndWorkPlaceAndPosition(candidate, workPlace, position))
            return new ErrorResult("the job experience that you want to create already exists");
        candidateJobExperienceDao.updateWorkPlace(workPlace, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updatePosition(short positionId, int id) {
        Position position = new Position();
        position.setId(positionId);
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateJobExperienceDao.existsById(id))
            errors.put("candidateJobExperienceId", "does not exist");
        if (position.getId() <= 0 || !positionDao.existsById(positionId))
            errors.put("position", "does not exist");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);
        CandidateJobExperience candidateJobExperience = candidateJobExperienceDao.getById(id);
        if (candidateJobExperience.getPosition().getId() == positionId)
            return new ErrorResult("position is the same");
        Candidate candidate = candidateJobExperience.getCandidate();
        String workPlace = candidateJobExperience.getWorkPlace();
        if (candidateJobExperienceDao.existsByCandidateAndWorkPlaceAndPosition(candidate, workPlace, position))
            return new ErrorResult("the job experience that you want to create already exists");
        candidateJobExperienceDao.updatePosition(position, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateStartYear(short startYear, int id) {
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateJobExperienceDao.existsById(id))
            errors.put("candidateJobExperienceId", "does not exist");
        if (startYear < 1900 || startYear > LocalDate.now().getYear())
            errors.put("startYear", "invalid startYear");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);
        CandidateJobExperience candidateJobExperience = candidateJobExperienceDao.getById(id);
        if (candidateJobExperience.getStartYear() == startYear)
            return new ErrorResult("startYear is the same");
        if (candidateJobExperience.getQuitYear() != null && candidateJobExperience.getQuitYear() < startYear)
            return new ErrorResult("startYear cannot be grater than quitYear");
        candidateJobExperienceDao.updateStartYear(startYear, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateQuitYear(Short quitYear, int id) {
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateJobExperienceDao.existsById(id))
            errors.put("candidateJobExperienceId", "does not exist");
        if (quitYear != null && (quitYear < 1900 || quitYear > LocalDate.now().getYear()))
            errors.put("quitYear", "invalid quitYear");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);
        CandidateJobExperience candidateJobExperience = candidateJobExperienceDao.getById(id);
        if (candidateJobExperience.getQuitYear() != null && candidateJobExperience.getQuitYear().equals(quitYear) ||
                (candidateJobExperience.getQuitYear() == null && quitYear == null))
            return new ErrorResult("quitYear is the same");
        if (quitYear != null && candidateJobExperience.getStartYear() > quitYear)
            return new ErrorResult("quitYear cannot be less than startYear");
        candidateJobExperienceDao.updateQuitYear(quitYear, id);
        return new SuccessResult("Success");
    }
}