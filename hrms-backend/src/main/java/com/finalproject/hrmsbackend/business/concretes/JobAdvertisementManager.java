package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.JobAdvertisementService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.entities.ApiError;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JobAdvertisementManager implements JobAdvertisementService {

    private final JobAdvertisementDao jobAdvertisementDao;
    private final JobAdvertisementUpdateDao jobAdvertisementUpdateDao;
    private final EmployerDao employerDao;
    private final PositionDao positionDao;
    private final CityDao cityDao;
    private final ModelMapper modelMapper;
    private final CheckService check;

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
        if (check.notExistsById(employerDao, jobAdvDto.getEmployerId()))
            return new ErrorResult(Msg.NOT_EXIST.get("Employer"));
        if (jobAdvertisementDao.existsByCity_IdAndPosition_IdAndEmployer_IdAndJobDescription(jobAdvDto.getCityId(), jobAdvDto.getPositionId(), jobAdvDto.getEmployerId(), jobAdvDto.getJobDescription()))
            return new ErrorResult(Msg.UK_JOB_ADV_ADD.get());
        ErrorDataResult<ApiError> errors = execCommonChecks(jobAdvDto);
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
        jobAdvertisementDao.deleteById(jobAdvId);
        return new SuccessDataResult<>(Msg.DELETED.get(), true);
    }

    @Override
    public Result update(JobAdvertisementDto jobAdvDto) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvDto.getId()))
            return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));
        ErrorDataResult<ApiError> errors = execCommonChecks(jobAdvDto);
        if (errors != null) return errors;

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvDto.getId());
        JobAdvertisementUpdate oldJobAdvUpd = jobAdv.getJobAdvertisementUpdate();
        JobAdvertisementUpdate newJobAdvUpd = modelMapper.map(jobAdvDto, JobAdvertisementUpdate.class);

        if (noChange(oldJobAdvUpd, newJobAdvUpd))
            return new ErrorResult(Msg.THE_SAME.get("All fields are"));
        if (violatesUk(oldJobAdvUpd, jobAdvDto))
            return new ErrorResult(Msg.UK_JOB_ADV_UPD.get());

        newJobAdvUpd.setUpdateId(oldJobAdvUpd.getUpdateId());
        newJobAdvUpd.setEmployer(oldJobAdvUpd.getEmployer());

        jobAdv.setJobAdvertisementUpdate(newJobAdvUpd);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updatePosition(short positionId, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));
        if (check.notExistsById(positionDao, positionId)) return new ErrorResult(Msg.NOT_EXIST.get("Position"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if (jobAdvUpdate.getPosition().getId() == positionId)
            return new ErrorResult(Msg.IS_THE_SAME.get("Position"));

        jobAdvUpdate.setPosition(positionDao.getById(positionId));
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateJobDesc(String jobDescription, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if (jobAdvUpdate.getJobDescription().equals(jobDescription))
            return new ErrorResult(Msg.IS_THE_SAME.get("Job description"));

        jobAdvUpdate.setJobDescription(jobDescription);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateCity(short cityId, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));
        if (check.notExistsById(cityDao, cityId)) return new ErrorResult(Msg.NOT_EXIST.get("City"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if (jobAdvUpdate.getCity().getId() == cityId)
            return new ErrorResult(Msg.IS_THE_SAME.get("City"));

        jobAdvUpdate.setCity(cityDao.getById(cityId));
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateMinSalary(Double minSalary, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if (check.equals(jobAdvUpdate.getMinSalary(), minSalary))
            return new ErrorResult(Msg.IS_THE_SAME.get("Minimum salary"));
        if (check.greater(minSalary, jobAdv.getMaxSalary()))
            return new ErrorResult(Msg.MIN_MAX_CONFLICT.get());

        jobAdvUpdate.setMinSalary(minSalary);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateMaxSalary(Double maxSalary, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if (check.equals(jobAdvUpdate.getMaxSalary(), maxSalary))
            return new ErrorResult(Msg.IS_THE_SAME.get("Maximum salary"));
        if (check.greater(jobAdv.getMinSalary(), maxSalary))
            return new ErrorResult(Msg.MIN_MAX_CONFLICT.get());

        jobAdvUpdate.setMaxSalary(maxSalary);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateWorkModel(String workModel, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if (jobAdvUpdate.getWorkModel().equals(workModel))
            return new ErrorResult(Msg.IS_THE_SAME.get("Work model"));

        jobAdvUpdate.setWorkModel(workModel);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateWorkTime(String workTime, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if (jobAdvUpdate.getWorkTime().equals(workTime))
            return new ErrorResult(Msg.IS_THE_SAME.get("Work time"));

        jobAdvUpdate.setWorkTime(workTime);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateOpenPositions(short openPositions, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if (jobAdvUpdate.getOpenPositions() == openPositions)
            return new ErrorResult(Msg.IS_THE_SAME.get("Open positions"));

        jobAdvUpdate.setOpenPositions(openPositions);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateDeadLine(LocalDate deadLine, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if (check.equals(jobAdvUpdate.getDeadline(), deadLine))
            return new ErrorResult(Msg.IS_THE_SAME.get("Deadline"));

        jobAdvUpdate.setDeadline(deadLine);
        return execLastUpdAct(jobAdv);
    }

    @Override
    public Result updateActivation(boolean activationStatus, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId))
            return new ErrorDataResult<>(Msg.NOT_EXIST.get("jobAdvId"), false);

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        jobAdv.setActive(activationStatus);
        JobAdvertisement savedJobAdv = jobAdvertisementDao.save(jobAdv);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedJobAdv);
    }

    @Override
    public Result updateVerification(boolean verificationStatus, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId))
            return new ErrorDataResult<>(Msg.NOT_EXIST.get("jobAdvId"), false);

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        jobAdv.setVerified(verificationStatus);
        jobAdv.setRejected(!verificationStatus);
        JobAdvertisement savedJobAdv = jobAdvertisementDao.save(jobAdv);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedJobAdv);
    }

    @Override
    public Result applyChanges(int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(Msg.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        modelMapper.map(jobAdv.getJobAdvertisementUpdate(), jobAdv);
        jobAdv.setUpdateVerified(true);
        JobAdvertisement savedJobAdv = jobAdvertisementDao.save(jobAdv);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedJobAdv);
    }

    private ErrorDataResult<ApiError> execCommonChecks(JobAdvertisementDto jobAdvDto) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(positionDao, jobAdvDto.getPositionId()))
            errors.put("positionId", Msg.NOT_EXIST.get());
        if (check.notExistsById(cityDao, jobAdvDto.getCityId()))
            errors.put("cityId", Msg.NOT_EXIST.get());
        if (check.greater(jobAdvDto.getMinSalary(), jobAdvDto.getMaxSalary()))
            errors.put("minMaxSalary", Msg.MIN_MAX_CONFLICT.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(Msg.FAILED.get(), new ApiError(errors));
        return null;
    }

    private Result execLastUpdAct(JobAdvertisement jobAdv) {
        boolean noChange = noChange(jobAdv.getJobAdvertisementUpdate(), modelMapper.map(jobAdv, JobAdvertisementUpdate.class));
        JobAdvertisementUpdate savedJobAdvUpdate = jobAdvertisementUpdateDao.save(jobAdv.getJobAdvertisementUpdate());
        jobAdvertisementDao.updateUpdateVerification(noChange, jobAdv.getId());
        jobAdv.setUpdateVerified(noChange);
        jobAdvertisementDao.updateLastModifiedAt(jobAdv.getId(), LocalDateTime.now());
        jobAdv.setJobAdvertisementUpdate(savedJobAdvUpdate);
        return new SuccessDataResult<>(Msg.SUCCESS_UPDATE_REQUEST.get(), jobAdv);
    }

    private boolean noChange(JobAdvertisementUpdate jobAdvUpd1, JobAdvertisementUpdate jobAdvUpd2) {
        return  check.equals(jobAdvUpd1.getPosition().getId(), jobAdvUpd2.getPosition().getId()) &&
                check.equals(jobAdvUpd1.getCity().getId(), jobAdvUpd2.getCity().getId()) &&
                check.equals(jobAdvUpd1.getMinSalary(), jobAdvUpd2.getMinSalary()) &&
                check.equals(jobAdvUpd1.getMaxSalary(), jobAdvUpd2.getMaxSalary()) &&
                jobAdvUpd1.getWorkModel().equals(jobAdvUpd2.getWorkModel()) &&
                jobAdvUpd1.getWorkTime().equals(jobAdvUpd2.getWorkTime()) &&
                check.equals(jobAdvUpd1.getOpenPositions(), jobAdvUpd2.getOpenPositions()) &&
                check.equals(jobAdvUpd1.getDeadline(), jobAdvUpd2.getDeadline()) &&
                jobAdvUpd1.getJobDescription().equals(jobAdvUpd2.getJobDescription());
    }

    private boolean violatesUk(JobAdvertisementUpdate jobAdvUpd, JobAdvertisementDto jobAdvDto) {
        return !(check.equals(jobAdvUpd.getPosition().getId(), jobAdvDto.getPositionId()) &&
                check.equals(jobAdvUpd.getCity().getId(), jobAdvDto.getCityId()) &&
                jobAdvUpd.getJobDescription().equals(jobAdvDto.getJobDescription()) &&
                check.equals(jobAdvUpd.getEmployer().getId(), jobAdvDto.getEmployerId()))
                &&
                jobAdvertisementUpdateDao.existsByCity_IdAndPosition_IdAndEmployer_IdAndJobDescription
                        (jobAdvDto.getCityId(), jobAdvDto.getPositionId(), jobAdvDto.getEmployerId(), jobAdvDto.getJobDescription());
    }

}
