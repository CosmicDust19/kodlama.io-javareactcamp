package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.JobAdvertisementService;
import com.finalproject.hrmsbackend.business.abstracts.check.EmployerCheckService;
import com.finalproject.hrmsbackend.business.abstracts.check.JobAdvertisementCheckService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.entities.ApiError;
import com.finalproject.hrmsbackend.core.utilities.CheckUtils;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.*;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisementUpdate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobAdvertisementManager implements JobAdvertisementService {

    private final JobAdvertisementDao jobAdvertisementDao;
    private final JobAdvertisementUpdateDao jobAdvertisementUpdateDao;
    private final PositionDao positionDao;
    private final CityDao cityDao;
    private final CheckService check;
    private final EmployerCheckService employerCheck;
    private final JobAdvertisementCheckService jobAdvertisementCheck;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<JobAdvertisement>> getAll(Short sortDirection, String propName) {
        Sort sort = Utils.getSortByDirection(sortDirection, propName != null ? propName : "createdAt");
        return new SuccessDataResult<>(Msg.SORT_DIRECTION.get(), jobAdvertisementDao.findAll(sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllByEmployer(Integer employerId) {
        return new SuccessDataResult<>(jobAdvertisementDao.findAllByEmployer_Id(employerId));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getActiveVerified() {
        return new SuccessDataResult<>(jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrue());
    }

    @Override
    public DataResult<List<JobAdvertisement>> getActiveVerifiedByCreatedAt(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "createdAt");
        return new SuccessDataResult<>(Msg.SORT_DIRECTION.getCustom("%s (createdAt)"), jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrue(sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getPublicByEmployer(int employerId, Short sortDirection, String propName) {
        Sort sort = Utils.getSortByDirection(sortDirection, propName != null ? propName : "createdAt");
        return new SuccessDataResult<>(jobAdvertisementDao.getAllByActiveTrueAndVerifiedTrueAndDeadlineAfterAndEmployer_Id(LocalDate.now(), employerId, sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getUnverified(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "createdAt");
        return new SuccessDataResult<>(Msg.SORT_DIRECTION.getCustom("%s (createdAt)"), jobAdvertisementDao.getAllByVerifiedFalse(sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getPublic(Short sortDirection, String propName) {
        Sort sort = Utils.getSortByDirection(sortDirection, propName != null ? propName : "createdAt");
        return new SuccessDataResult<>(Msg.SORT_DIRECTION.get(), jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrueAndDeadlineAfterAndEmployer_VerifiedTrue(LocalDate.now(), sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getActiveVerifiedPast() {
        return new SuccessDataResult<>(jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrueAndDeadlineBefore(LocalDate.now()));
    }

    @Override
    public DataResult<JobAdvertisement> getById(int jobAdvId) {
        return new SuccessDataResult<>(jobAdvertisementDao.getById(jobAdvId));
    }

    @Override
    public Result add(JobAdvertisementDto jobAdvDto) {
        employerCheck.existsEmployerById(jobAdvDto.getEmployerId());
        check.existsPositionById(jobAdvDto.getPositionId());
        check.existsCityById(jobAdvDto.getCityId());
        jobAdvertisementCheck.checkIfViolatesUkAdd(jobAdvDto);
        check.noMinMaxConflict(jobAdvDto.getMinSalary(), jobAdvDto.getMaxSalary());
        ErrorDataResult<ApiError> errors = Utils.getErrorsIfExist(check);
        if (errors != null) return errors;

        jobAdvDto.setId(null);
        JobAdvertisement jobAdv = modelMapper.map(jobAdvDto, JobAdvertisement.class);
        JobAdvertisement savedJobAdv = jobAdvertisementDao.save(jobAdv);
        JobAdvertisementUpdate jobAdvUpd = modelMapper.map(savedJobAdv, JobAdvertisementUpdate.class);
        JobAdvertisementUpdate savedJobAdvUpd = jobAdvertisementUpdateDao.save(jobAdvUpd);

        jobAdvertisementDao.updateUpdateId(savedJobAdvUpd.getUpdateId(), savedJobAdv.getId());
        savedJobAdv.setJobAdvertisementUpdate(savedJobAdvUpd);
        savedJobAdv.setPosition(positionDao.getById(savedJobAdv.getPosition().getId()));
        savedJobAdv.setCity(cityDao.getById(savedJobAdv.getCity().getId()));
        return new SuccessDataResult<>(Msg.SAVED.get(), savedJobAdv);
    }

    @Override
    public DataResult<Boolean> deleteById(int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        jobAdvertisementDao.deleteById(jobAdvId);
        return new SuccessDataResult<>(Msg.DELETED.get(), true);
    }

    @Override
    public Result update(JobAdvertisementDto jobAdvDto) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvDto.getId());
        check.existsPositionById(jobAdvDto.getPositionId());
        check.existsCityById(jobAdvDto.getCityId());

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvDto.getId());
        if (!jobAdvertisementCheck.changed(modelMapper.map(jobAdvDto, JobAdvertisement.class), jobAdv.getJobAdvertisementUpdate()))
            return new ErrorResult(Msg.THE_SAME.get("All fields are"));
        check.noMinMaxConflict(jobAdvDto.getMinSalary(), jobAdvDto.getMaxSalary());
        jobAdvertisementCheck.checkIfViolatesUkUpdate(jobAdvDto, jobAdv.getJobAdvertisementUpdate());

        JobAdvertisementUpdate jobAdvUpd = modelMapper.map(jobAdvDto, JobAdvertisementUpdate.class);
        jobAdvUpd.setUpdateId(jobAdv.getJobAdvertisementUpdate().getUpdateId());
        jobAdvUpd.setEmployer(jobAdv.getJobAdvertisementUpdate().getEmployer());
        jobAdv.setJobAdvertisementUpdate(jobAdvUpd);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updatePosition(short positionId, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        check.existsPositionById(positionId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        check.notTheSame(jobAdv.getJobAdvertisementUpdate().getPosition().getId(), positionId, "Position");
        jobAdv.getJobAdvertisementUpdate().setPosition(positionDao.getById(positionId));
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateJobDesc(String jobDescription, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        check.notTheSame(jobAdv.getJobAdvertisementUpdate().getJobDescription(), jobDescription, "Job description");
        jobAdv.getJobAdvertisementUpdate().setJobDescription(jobDescription);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateCity(short cityId, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        check.existsCityById(cityId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        check.notTheSame(jobAdv.getJobAdvertisementUpdate().getCity().getId(), cityId, "City");
        jobAdv.getJobAdvertisementUpdate().setCity(cityDao.getById(cityId));
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateMinSalary(Double minSalary, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        check.notTheSame(jobAdv.getJobAdvertisementUpdate().getMinSalary(), minSalary, "Minimum salary");
        check.noMinMaxConflict(minSalary, jobAdv.getJobAdvertisementUpdate().getMaxSalary());
        jobAdv.getJobAdvertisementUpdate().setMinSalary(minSalary);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateMaxSalary(Double maxSalary, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        check.notTheSame(jobAdv.getJobAdvertisementUpdate().getMaxSalary(), maxSalary, "Maximum salary");
        check.noMinMaxConflict(jobAdv.getJobAdvertisementUpdate().getMinSalary(), maxSalary);
        jobAdv.getJobAdvertisementUpdate().setMaxSalary(maxSalary);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateWorkModel(String workModel, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        check.notTheSame(jobAdv.getJobAdvertisementUpdate().getWorkModel(), workModel, "Working model");
        jobAdv.getJobAdvertisementUpdate().setWorkModel(workModel);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateWorkTime(String workTime, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        check.notTheSame(jobAdv.getJobAdvertisementUpdate().getWorkTime(), workTime, "Working time");
        jobAdv.getJobAdvertisementUpdate().setWorkTime(workTime);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateOpenPositions(short openPositions, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        check.notTheSame(jobAdv.getJobAdvertisementUpdate().getOpenPositions(), openPositions, "Open positions");
        jobAdv.getJobAdvertisementUpdate().setOpenPositions(openPositions);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateDeadLine(LocalDate deadLine, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        check.notTheSame(jobAdv.getJobAdvertisementUpdate().getDeadline().toString(), deadLine.toString(), "Deadline");
        jobAdv.getJobAdvertisementUpdate().setDeadline(deadLine);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateActivation(boolean activationStatus, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        jobAdv.setActive(activationStatus);
        JobAdvertisement savedJobAdv = jobAdvertisementDao.save(jobAdv);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedJobAdv);
    }

    @Override
    public Result updateVerification(boolean verificationStatus, int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        jobAdv.setVerified(verificationStatus);
        jobAdv.setRejected(!verificationStatus);
        JobAdvertisement savedJobAdv = jobAdvertisementDao.save(jobAdv);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedJobAdv);
    }

    @Override
    public Result applyChanges(int jobAdvId) {
        jobAdvertisementCheck.existsJobAdvertById(jobAdvId);
        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        modelMapper.map(jobAdv.getJobAdvertisementUpdate(), jobAdv);
        jobAdv.setUpdateVerified(true);
        JobAdvertisement savedJobAdv = jobAdvertisementDao.save(jobAdv);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedJobAdv);
    }

    private Result execLastUpdAct(JobAdvertisement jobAdv) {
        ErrorDataResult<ApiError> errors = Utils.getErrorsIfExist(check);
        if (errors != null) return errors;
        boolean noChange = !jobAdvertisementCheck.changed(jobAdv, null);
        JobAdvertisementUpdate savedJobAdvUpdate = jobAdvertisementUpdateDao.save(jobAdv.getJobAdvertisementUpdate());
        jobAdvertisementDao.updateUpdateVerification(noChange, jobAdv.getId());
        jobAdv.setUpdateVerified(noChange);
        jobAdvertisementDao.updateLastModifiedAt(jobAdv.getId(), LocalDateTime.now());
        jobAdv.setJobAdvertisementUpdate(savedJobAdvUpdate);
        return new SuccessDataResult<>(Msg.SUCCESS_UPDATE_REQUEST.get(), jobAdv);
    }

}
