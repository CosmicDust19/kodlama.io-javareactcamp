package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.JobAdvertisementService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.*;
import com.finalproject.hrmsbackend.entities.concretes.City;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisementUpdate;
import com.finalproject.hrmsbackend.entities.concretes.Position;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementAddDto;
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
    public DataResult<List<JobAdvertisement>> getAll() {
        return new SuccessDataResult<>(jobAdvertisementDao.findAll());
    }

    @Override
    public DataResult<List<JobAdvertisement>> getActiveVerified() {
        return new SuccessDataResult<>(jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrue());
    }

    @Override
    public DataResult<List<JobAdvertisement>> getActiveVerifiedByCreatedAt(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "createdAt");
        return new SuccessDataResult<>(MSGs.SORT_DIRECTION.getCustom("%s (createdAt)"), jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrue(sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getPublicByEmployer(int employerId) {
        return new SuccessDataResult<>(jobAdvertisementDao.getAllByActiveTrueAndVerifiedTrueAndDeadlineAfterAndEmployer_Id(LocalDate.now(), employerId));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getUnverified(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "createdAt");
        return new SuccessDataResult<>(MSGs.SORT_DIRECTION.getCustom("%s (createdAt)"), jobAdvertisementDao.getAllByVerifiedFalse(sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getPublic(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "createdAt");
        return new SuccessDataResult<>(MSGs.SORT_DIRECTION.getCustom("%s (createdAt)"), jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrueAndDeadlineAfterAndEmployer_VerifiedTrue(LocalDate.now(), sort));
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
    public Result add(JobAdvertisementAddDto jobAdvertisementAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(employerDao, jobAdvertisementAddDto.getEmployerId()))
            errors.put("employerId", MSGs.NOT_EXIST.get());
        if (check.notExistsById(positionDao, jobAdvertisementAddDto.getPositionId()))
            errors.put("positionId", MSGs.NOT_EXIST.get());
        if (check.notExistsById(cityDao, jobAdvertisementAddDto.getCityId()))
            errors.put("cityId", MSGs.NOT_EXIST.get());
        if (check.greater(jobAdvertisementAddDto.getMinSalary(), jobAdvertisementAddDto.getMaxSalary()))
            errors.put("minSalary - maxSalary", MSGs.MIN_MAX_CONFLICT.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        JobAdvertisement jobAdvertisement = modelMapper.map(jobAdvertisementAddDto, JobAdvertisement.class);

        jobAdvertisementDao.save(jobAdvertisement);
        return new SuccessResult(MSGs.SAVED.get());
    }

    @Override
    public DataResult<Boolean> deleteById(int jobAdvId) {
        jobAdvertisementDao.deleteById(jobAdvId);
        return new SuccessDataResult<>(MSGs.DELETED.get(), true);
    }

    @Override
    public Result updatePosition(short positionId, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvId"));
        if (check.notExistsById(positionDao, positionId)) return new ErrorResult(MSGs.NOT_EXIST.get("positionId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getPosition().getId() == positionId) ||
                (jobAdvUpdate == null && jobAdv.getPosition().getId() == positionId))
            return new ErrorResult(MSGs.THE_SAME.get("position is"));

        handleLastUpdateActions(jobAdv);
        jobAdvertisementUpdateDao.updatePosition(new Position(positionId), jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateJobDesc(String jobDescription, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getJobDescription().equals(jobDescription)) ||
                (jobAdvUpdate == null && jobAdv.getJobDescription().equals(jobDescription)))
            return new ErrorResult(MSGs.THE_SAME.get("jobDescription is"));

        handleLastUpdateActions(jobAdv);
        jobAdvertisementUpdateDao.updateJobDesc(jobDescription, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateCity(short cityId, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvId"));
        if (check.notExistsById(cityDao, cityId)) return new ErrorResult(MSGs.NOT_EXIST.get("cityId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getCity().getId() == cityId) ||
                (jobAdvUpdate == null && jobAdv.getCity().getId() == cityId))
            return new ErrorResult(MSGs.THE_SAME.get("cityId is"));

        handleLastUpdateActions(jobAdv);
        jobAdvertisementUpdateDao.updateCity(new City(cityId), jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateMinSalary(Double minSalary, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && check.equals(jobAdvUpdate.getMinSalary(), minSalary)) ||
                (jobAdvUpdate == null && check.equals(jobAdv.getMinSalary(), minSalary)))
            return new ErrorResult(MSGs.THE_SAME.get("minSalary is"));
        if (check.greater(minSalary, jobAdv.getMaxSalary()))
            return new ErrorResult(MSGs.MIN_MAX_CONFLICT.get());

        handleLastUpdateActions(jobAdv);
        jobAdvertisementUpdateDao.updateMinSalary(minSalary, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateMaxSalary(Double maxSalary, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && check.equals(jobAdvUpdate.getMaxSalary(), maxSalary)) ||
                (jobAdvUpdate == null && check.equals(jobAdv.getMaxSalary(), maxSalary)))
            return new ErrorResult(MSGs.THE_SAME.get("maxSalary is"));
        if (check.greater(jobAdv.getMinSalary(), maxSalary))
            return new ErrorResult(MSGs.MIN_MAX_CONFLICT.get());

        handleLastUpdateActions(jobAdv);
        jobAdvertisementUpdateDao.updateMaxSalary(maxSalary, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateWorkModel(String workModel, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getWorkModel().equals(workModel)) ||
                (jobAdvUpdate == null && jobAdv.getWorkModel().equals(workModel)))
            return new ErrorResult(MSGs.THE_SAME.get("workModel is"));

        handleLastUpdateActions(jobAdv);
        jobAdvertisementUpdateDao.updateWorkModel(workModel, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateWorkTime(String workTime, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getWorkTime().equals(workTime)) ||
                (jobAdvUpdate == null && jobAdv.getWorkTime().equals(workTime)))
            return new ErrorResult(MSGs.THE_SAME.get("workTime is"));

        handleLastUpdateActions(jobAdv);
        jobAdvertisementUpdateDao.updateWorkTime(workTime, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateOpenPositions(short openPositions, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getOpenPositions() == openPositions) ||
                (jobAdvUpdate == null && jobAdv.getOpenPositions() == openPositions))
            return new ErrorResult(MSGs.THE_SAME.get("openPositions is"));

        handleLastUpdateActions(jobAdv);
        jobAdvertisementUpdateDao.updateOpenPositions(openPositions, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateDeadLine(LocalDate deadLine, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(jobAdvId);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && check.equals(jobAdvUpdate.getDeadline(), deadLine)) ||
                (jobAdvUpdate == null && check.equals(jobAdv.getDeadline(), deadLine)))
            return new ErrorResult(MSGs.THE_SAME.get("deadline is"));

        handleLastUpdateActions(jobAdv);
        jobAdvertisementUpdateDao.updateDeadLine(deadLine, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result applyChanges(int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("jobAdvId"));

        JobAdvertisement jobAdvertisement = jobAdvertisementDao.getById(jobAdvId);
        if (jobAdvertisement.getJobAdvertisementUpdate() == null) return new ErrorResult(MSGs.NO_UPDATE.get());

        jobAdvertisementDao.applyUpdates(jobAdvertisement.getJobAdvertisementUpdate(), jobAdvId);
        jobAdvertisementDao.updateUpdateVerification(true, jobAdvId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateActivation(boolean activationStatus, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorDataResult<>(MSGs.NOT_EXIST.get("jobAdvId"), false);
        jobAdvertisementDao.updateActivation(activationStatus, jobAdvId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateVerification(boolean verificationStatus, int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorDataResult<>(MSGs.NOT_EXIST.get("jobAdvId"), false);
        jobAdvertisementDao.updateVerification(verificationStatus, jobAdvId);
        jobAdvertisementDao.updateRejection(!verificationStatus, jobAdvId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    private JobAdvertisementUpdate createJobAdvUpdate(JobAdvertisement jobAdv) {
        JobAdvertisementUpdate jobAdvertisementUpdate = modelMapper.map(jobAdv, JobAdvertisementUpdate.class);
        JobAdvertisementUpdate savedJobAdvertisementUpdate = jobAdvertisementUpdateDao.save(jobAdvertisementUpdate);
        jobAdvertisementDao.updateUpdateId(savedJobAdvertisementUpdate.getUpdateId(), jobAdv.getId());
        return savedJobAdvertisementUpdate;
    }

    private void handleLastUpdateActions(JobAdvertisement jobAdv) {
        if (jobAdv.getJobAdvertisementUpdate() == null) jobAdv.setJobAdvertisementUpdate(createJobAdvUpdate(jobAdv));
        jobAdvertisementDao.updateUpdateVerification(false, jobAdv.getId());
        jobAdvertisementDao.updateLastModifiedAt(jobAdv.getId(), LocalDateTime.now());
    }

    private SuccessDataResult<Integer> getUpdateResult(JobAdvertisement jobAdv) {
        return new SuccessDataResult<>(MSGs.SUCCESS_UPDATE_REQUEST.get(), jobAdv.getJobAdvertisementUpdate().getUpdateId());
    }

}
