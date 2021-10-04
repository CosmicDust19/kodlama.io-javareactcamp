package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateJobExperienceService;
import com.finalproject.hrmsbackend.business.abstracts.check.CandidateCheckService;
import com.finalproject.hrmsbackend.business.abstracts.check.CandidateJobExpCheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateJobExperienceDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.PositionDao;
import com.finalproject.hrmsbackend.entities.concretes.CandidateJobExperience;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateJobExperienceAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateJobExperienceManager implements CandidateJobExperienceService {

    private final CandidateJobExperienceDao candidateJobExpDao;
    private final PositionDao positionDao;
    private final CheckService check;
    private final CandidateCheckService candidateCheck;
    private final CandidateJobExpCheckService candidateJobExpCheck;
    private final ModelMapper modelMapper;

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
    public DataResult<?> add(CandidateJobExperienceAddDto candJobExpAddDto) {
        candidateCheck.existsCandidateById(candJobExpAddDto.getCandidateId());
        check.existsPositionById(candJobExpAddDto.getPositionId());
        candidateJobExpCheck.checkIfViolatesUk(candJobExpAddDto);
        check.noStartEndYearConflict(candJobExpAddDto.getStartYear(), candJobExpAddDto.getQuitYear());
        ErrorDataResult<ApiError> errors = Utils.getErrorsIfExist(check);
        if (errors != null) return errors;

        CandidateJobExperience candJobExp = modelMapper.map(candJobExpAddDto, CandidateJobExperience.class);
        CandidateJobExperience savedCandJobExp = candidateJobExpDao.save(candJobExp);
        savedCandJobExp.setPosition(positionDao.getById(savedCandJobExp.getPosition().getId()));
        return new SuccessDataResult<>(Msg.SAVED.get(), savedCandJobExp);
    }

    @Override
    public Result deleteById(int candJobExpId) {
        candidateJobExpCheck.existsCandidateJobExpById(candJobExpId);
        candidateJobExpDao.deleteById(candJobExpId);
        return new SuccessResult(Msg.DELETED.get());
    }

    @Override
    public Result updateWorkPlace(String workPlace, int candJobExpId) {
        candidateJobExpCheck.existsCandidateJobExpById(candJobExpId);
        CandidateJobExperience candJobExp = candidateJobExpDao.getById(candJobExpId);
        check.notTheSame(candJobExp.getWorkPlace(), workPlace, "Work place");
        candJobExp.setWorkPlace(workPlace);
        return execLastUpdAct(candJobExp);
    }

    @Override
    public Result updatePosition(short positionId, int candJobExpId) {
        candidateJobExpCheck.existsCandidateJobExpById(candJobExpId);
        check.existsPositionById(positionId);
        CandidateJobExperience candJobExp = candidateJobExpDao.getById(candJobExpId);
        check.notTheSame(candJobExp.getPosition().getId(), positionId, "Position");
        candJobExp.setPosition(positionDao.getById(positionId));
        return execLastUpdAct(candJobExp);
    }

    @Override
    public Result updateStartYear(short startYear, int candJobExpId) {
        candidateJobExpCheck.existsCandidateJobExpById(candJobExpId);
        CandidateJobExperience candJobExp = candidateJobExpDao.getById(candJobExpId);
        check.notTheSame(candJobExp.getStartYear(), startYear, "Start year");
        check.noStartEndYearConflict(startYear, candJobExp.getQuitYear());
        candJobExp.setStartYear(startYear);
        return execLastUpdAct(candJobExp);
    }

    @Override
    public Result updateQuitYear(Short quitYear, int candJobExpId) {
        candidateJobExpCheck.existsCandidateJobExpById(candJobExpId);
        CandidateJobExperience candJobExp = candidateJobExpDao.getById(candJobExpId);
        check.notTheSame(candJobExp.getQuitYear(), quitYear, "Quit year");
        check.noStartEndYearConflict(candJobExp.getStartYear(), quitYear);
        candJobExp.setQuitYear(quitYear);
        return execLastUpdAct(candJobExp);
    }

    private Result execLastUpdAct(CandidateJobExperience candJobExp) {
        ErrorDataResult<ApiError> errors = Utils.getErrorsIfExist(check);
        if (errors != null) return errors;
        CandidateJobExperience savedCandJobExp = candidateJobExpDao.save(candJobExp);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandJobExp);
    }

}