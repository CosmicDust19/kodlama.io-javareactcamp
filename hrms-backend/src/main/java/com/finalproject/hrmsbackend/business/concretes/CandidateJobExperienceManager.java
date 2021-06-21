package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateJobExperienceService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateJobExperienceDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.PositionDao;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
import com.finalproject.hrmsbackend.entities.concretes.Position;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateJobExperienceAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
            errors.put("candidateId","does not exist");
        if (candidateJobExperienceAddDto.getQuitYear() != null && candidateJobExperience.getStartYear() > candidateJobExperienceAddDto.getQuitYear())
            errors.put("startYear - quitYear", "the quit year cannot be a date before the start year");
        if (candidateJobExperience.getWorkPlace() == null || candidateJobExperience.getWorkPlace().isEmpty())
            errors.put("workPlace", "workplace cannot be empty");

        Position position = candidateJobExperience.getPosition();
        position.setTitle(Utils.formName(position.getTitle()));
        if (!Utils.tryToSaveIfNotExists(position, positionDao))
            position.setId(positionDao.getByTitle(position.getTitle()).getId());

        if (candidateJobExperienceDao.existsByCandidateAndWorkPlaceAndPosition(candidateJobExperience.getCandidate(), candidateJobExperience.getWorkPlace(), candidateJobExperience.getPosition()))
            errors.put("unique key", "candidate, workplace and position is used together before");

        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);

        try {
            candidateJobExperienceDao.save(candidateJobExperience);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            return new ErrorDataResult<>("save","an unknown error has occurred");
        }

        return new SuccessResult("Success");
    }
}