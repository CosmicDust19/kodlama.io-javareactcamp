package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateJobExperienceService;
import com.finalproject.hrmsbackend.core.business.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
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
    private final CandidateJobExperienceDao candidateJobExpDao;
    private final PositionDao positionDao;
    private final ModelMapper modelMapper;
    private final CheckService check;

    @Override
    public DataResult<List<CandidateJobExperience>> getAll() {
        return new SuccessDataResult<>(candidateJobExpDao.findAll());
    }

    @Override
    public DataResult<List<CandidateJobExperience>> getAllByQuitYear(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "quitYear");
        return new SuccessDataResult<>(MSGs.SORT_DIRECTION.getCustom("%s (quitYear)"), candidateJobExpDao.findAll(sort));
    }

    @Override
    public Result add(CandidateJobExperienceAddDto candidateJobExperienceAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(candidateDao, candidateJobExperienceAddDto.getCandidateId()))
            errors.put("candidateId", MSGs.NOT_EXIST.get());
        if (check.notExistsById(positionDao, candidateJobExperienceAddDto.getPosition().getId()))
            errors.put("position", MSGs.NOT_EXIST.get());
        if (check.startEndConflict(candidateJobExperienceAddDto.getStartYear(), candidateJobExperienceAddDto.getQuitYear()))
            errors.put("startYear - quitYear", MSGs.START_END_CONFLICT.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        CandidateJobExperience candidateJobExp = modelMapper.map(candidateJobExperienceAddDto, CandidateJobExperience.class);

        CandidateJobExperience savedCandidateJobExperience = candidateJobExpDao.save(candidateJobExp);
        return new SuccessResult(Integer.toString(savedCandidateJobExperience.getId()));
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        candidateJobExpDao.deleteById(id);
        return new SuccessDataResult<>(MSGs.DELETED.get(), true);
    }

    @Override
    public Result updateWorkPlace(String workPlace, int id) {
        if (check.notExistsById(candidateJobExpDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));
        candidateJobExpDao.updateWorkPlace(workPlace, id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updatePosition(short positionId, int id) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(candidateJobExpDao, id)) errors.put("id", MSGs.NOT_EXIST.get());
        if (check.notExistsById(positionDao, positionId)) errors.put("position", MSGs.NOT_EXIST.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        candidateJobExpDao.updatePosition(new Position(positionId), id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateStartYear(short startYear, int id) {
        if (check.notExistsById(candidateJobExpDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        CandidateJobExperience candidateJobExp = candidateJobExpDao.getById(id);
        if (candidateJobExp.getStartYear() == startYear)
            return new ErrorResult(MSGs.THE_SAME.get("startYear is"));
        if (check.startEndConflict(startYear, candidateJobExp.getQuitYear()))
            return new ErrorResult(MSGs.START_END_CONFLICT.get());

        candidateJobExpDao.updateStartYear(startYear, id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateQuitYear(Short quitYear, int id) {
        if (check.notExistsById(candidateJobExpDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        CandidateJobExperience candidateJobExperience = candidateJobExpDao.getById(id);
        if (check.equals(candidateJobExperience.getQuitYear(), quitYear))
            return new ErrorResult(MSGs.THE_SAME.get("quitYear is"));
        if (check.startEndConflict(candidateJobExperience.getStartYear(), quitYear))
            return new ErrorResult(MSGs.START_END_CONFLICT.get());

        candidateJobExpDao.updateQuitYear(quitYear, id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

}