package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateJobExperienceService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateJobExperienceDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.PositionDao;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
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
    public DataResult<List<CandidateJobExperience>> getByQuitYear(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "quitYear");
        return new SuccessDataResult<>(Msg.SORT_DIRECTION.getCustom("%s (quitYear)"), candidateJobExpDao.findAll(sort));
    }

    @Override
    public Result add(CandidateJobExperienceAddDto candJobExpAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(candidateDao, candJobExpAddDto.getCandidateId()))
            errors.put("candidateId", Msg.NOT_EXIST.get("Candidate"));
        if (check.notExistsById(positionDao, candJobExpAddDto.getPositionId()))
            errors.put("positionId", Msg.NOT_EXIST.get("Position"));
        if (check.startEndConflict(candJobExpAddDto.getStartYear(), candJobExpAddDto.getQuitYear()))
            errors.put("startQuitYear", Msg.START_END_YEAR_CONFLICT.get());
        if (violatesUk(candJobExpAddDto))
            errors.put("uk", Msg.UK_CAND_JOB_EXP.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(Msg.FAILED.get(), new ApiError(errors));

        CandidateJobExperience candJobExp = modelMapper.map(candJobExpAddDto, CandidateJobExperience.class);

        CandidateJobExperience savedCandJobExp = candidateJobExpDao.save(candJobExp);
        savedCandJobExp.setPosition(positionDao.getById(savedCandJobExp.getPosition().getId()));
        return new SuccessDataResult<>(Msg.SAVED.get(), savedCandJobExp);
    }

    @Override
    public Result deleteById(int candJobExpId) {
        candidateJobExpDao.deleteById(candJobExpId);
        return new SuccessResult(Msg.DELETED.get());
    }

    @Override
    public Result updateWorkPlace(String workPlace, int candJobExpId) {
        if (check.notExistsById(candidateJobExpDao, candJobExpId))
            return new ErrorResult(Msg.NOT_EXIST.get("candJobExpId"));

        CandidateJobExperience candJobExp = candidateJobExpDao.getById(candJobExpId);
        if (candJobExp.getWorkPlace().equals(workPlace))
            return new ErrorResult(Msg.IS_THE_SAME.get("Work place"));

        candJobExp.setWorkPlace(workPlace);
        CandidateJobExperience savedCandJobExp = candidateJobExpDao.save(candJobExp);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandJobExp);
    }

    @Override
    public Result updatePosition(short positionId, int candJobExpId) {
        if (check.notExistsById(candidateJobExpDao, candJobExpId))
            return new ErrorResult(Msg.NOT_EXIST.get("candJobExpId"));
        if (check.notExistsById(positionDao, positionId))
            return new ErrorResult(Msg.NOT_EXIST.get("Position"));

        CandidateJobExperience candJobExp = candidateJobExpDao.getById(candJobExpId);
        if (candJobExp.getPosition().getId() == positionId)
            return new ErrorResult(Msg.IS_THE_SAME.get("Position"));

        candJobExp.setPosition(positionDao.getById(positionId));
        CandidateJobExperience savedCandJobExp = candidateJobExpDao.save(candJobExp);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandJobExp);
    }

    @Override
    public Result updateStartYear(short startYear, int candJobExpId) {
        if (check.notExistsById(candidateJobExpDao, candJobExpId))
            return new ErrorResult(Msg.NOT_EXIST.get("candJobExpId"));

        CandidateJobExperience candJobExp = candidateJobExpDao.getById(candJobExpId);
        if (candJobExp.getStartYear() == startYear)
            return new ErrorResult(Msg.IS_THE_SAME.get("Start year"));
        if (check.startEndConflict(startYear, candJobExp.getQuitYear()))
            return new ErrorResult(Msg.START_END_YEAR_CONFLICT.get());

        candJobExp.setStartYear(startYear);
        CandidateJobExperience savedCandJobExp = candidateJobExpDao.save(candJobExp);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandJobExp);
    }

    @Override
    public Result updateQuitYear(Short quitYear, int candJobExpId) {
        if (check.notExistsById(candidateJobExpDao, candJobExpId))
            return new ErrorResult(Msg.NOT_EXIST.get("candJobExpId"));

        CandidateJobExperience candJobExp = candidateJobExpDao.getById(candJobExpId);
        if (check.equals(candJobExp.getQuitYear(), quitYear))
            return new ErrorResult(Msg.IS_THE_SAME.get("Quit year"));
        if (check.startEndConflict(candJobExp.getStartYear(), quitYear))
            return new ErrorResult(Msg.START_END_YEAR_CONFLICT.get());

        candJobExp.setQuitYear(quitYear);
        CandidateJobExperience savedCandJobExp = candidateJobExpDao.save(candJobExp);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandJobExp);
    }

    private boolean violatesUk(CandidateJobExperienceAddDto candJobExpAddDto) {
        return candidateJobExpDao.existsByWorkPlaceAndPosition_IdAndCandidate_Id
                (candJobExpAddDto.getWorkPlace(), candJobExpAddDto.getPositionId(), candJobExpAddDto.getCandidateId());
    }

}