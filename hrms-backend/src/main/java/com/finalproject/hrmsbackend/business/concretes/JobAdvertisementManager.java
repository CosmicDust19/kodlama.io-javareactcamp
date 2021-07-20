package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.JobAdvertisementService;
import com.finalproject.hrmsbackend.core.business.CheckService;
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
    public DataResult<List<JobAdvertisement>> getAllActiveVerified() {
        return new SuccessDataResult<>(jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrue());
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllActiveVerifiedByDate(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "createdAt");
        return new SuccessDataResult<>(MSGs.SORT_DIRECTION.getCustom("%s (createdAt)"), jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrue(sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllPublicByEmployer(int employerId) {
        return new SuccessDataResult<>(jobAdvertisementDao.getAllByActiveTrueAndVerifiedTrueAndDeadlineAfterAndEmployer_Id(LocalDate.now(), employerId));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllUnverified(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "createdAt");
        return new SuccessDataResult<>(MSGs.SORT_DIRECTION.getCustom("%s (createdAt)"), jobAdvertisementDao.getAllByVerifiedFalse(sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllPublic(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "createdAt");
        return new SuccessDataResult<>(MSGs.SORT_DIRECTION.getCustom("%s (createdAt)"), jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrueAndDeadlineAfterAndEmployer_VerifiedTrue(LocalDate.now(), sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllActiveVerifiedPast() {
        return new SuccessDataResult<>(jobAdvertisementDao.findAllByActiveTrueAndVerifiedTrueAndDeadlineBefore(LocalDate.now()));
    }

    @Override
    public DataResult<JobAdvertisement> getById(int id) {
        return new SuccessDataResult<>(jobAdvertisementDao.getById(id));
    }

    @Override
    public Result add(JobAdvertisementAddDto jobAdvertisementAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(employerDao, jobAdvertisementAddDto.getEmployerId()))
            errors.put("employerId", MSGs.NOT_EXIST.get());
        if (check.notExistsById(positionDao, jobAdvertisementAddDto.getPosition().getId()))
            errors.put("positionId", MSGs.NOT_EXIST.get());
        if (check.notExistsById(cityDao, jobAdvertisementAddDto.getCity().getId()))
            errors.put("cityId", MSGs.NOT_EXIST.get());
        if (check.greater(jobAdvertisementAddDto.getMinSalary(), jobAdvertisementAddDto.getMaxSalary()))
            errors.put("minSalary - maxSalary", MSGs.MIN_MAX_CONFLICT.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        JobAdvertisement jobAdvertisement = modelMapper.map(jobAdvertisementAddDto, JobAdvertisement.class);

        jobAdvertisementDao.save(jobAdvertisement);
        return new SuccessResult(MSGs.SAVED.get());
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        jobAdvertisementDao.deleteById(id);
        return new SuccessDataResult<>(MSGs.DELETED.get(), true);
    }

    @Override
    public Result updatePosition(short positionId, int id) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(jobAdvertisementDao, id)) errors.put("id", MSGs.NOT_EXIST.get());
        if (check.notExistsById(positionDao, positionId)) errors.put("position", MSGs.NOT_EXIST.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(id);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getPosition().getId() == positionId) ||
                (jobAdvUpdate == null && jobAdv.getPosition().getId() == positionId))
            return new ErrorResult(MSGs.THE_SAME.get("position is"));

        handleLastActions(jobAdv);
        jobAdvertisementUpdateDao.updatePosition(new Position(positionId), jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateJobDesc(String jobDescription, int id) {
        if (check.notExistsById(jobAdvertisementDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(id);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getJobDescription().equals(jobDescription)) ||
                (jobAdvUpdate == null && jobAdv.getJobDescription().equals(jobDescription)))
            return new ErrorResult(MSGs.THE_SAME.get("jobDescription is"));

        handleLastActions(jobAdv);
        jobAdvertisementUpdateDao.updateJobDesc(jobDescription, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateCity(short cityId, int id) {
        Map<String, String> errors = new HashMap<>();
        if (check.notExistsById(jobAdvertisementDao, id)) errors.put("id", MSGs.NOT_EXIST.get());
        if (check.notExistsById(cityDao, cityId)) errors.put("city", MSGs.NOT_EXIST.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(id);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getCity().getId() == cityId) ||
                (jobAdvUpdate == null && jobAdv.getCity().getId() == cityId))
            return new ErrorResult(MSGs.THE_SAME.get("cityId is"));

        handleLastActions(jobAdv);
        jobAdvertisementUpdateDao.updateCity(new City(cityId), jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateMinSalary(Double minSalary, int id) {
        if (check.notExistsById(jobAdvertisementDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(id);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && check.equals(jobAdvUpdate.getMinSalary(), minSalary)) ||
                (jobAdvUpdate == null && check.equals(jobAdv.getMinSalary(), minSalary)))
            return new ErrorResult(MSGs.THE_SAME.get("minSalary is"));
        if (check.greater(minSalary, jobAdv.getMaxSalary()))
            return new ErrorResult(MSGs.MIN_MAX_CONFLICT.get());

        handleLastActions(jobAdv);
        jobAdvertisementUpdateDao.updateMinSalary(minSalary, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateMaxSalary(Double maxSalary, int id) {
        if (check.notExistsById(jobAdvertisementDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(id);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && check.equals(jobAdvUpdate.getMaxSalary(), maxSalary)) ||
                (jobAdvUpdate == null && check.equals(jobAdv.getMaxSalary(), maxSalary)))
            return new ErrorResult(MSGs.THE_SAME.get("maxSalary is"));
        if (check.greater(jobAdv.getMinSalary(), maxSalary))
            return new ErrorResult(MSGs.MIN_MAX_CONFLICT.get());

        handleLastActions(jobAdv);
        jobAdvertisementUpdateDao.updateMaxSalary(maxSalary, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateWorkModel(String workModel, int id) {
        if (check.notExistsById(jobAdvertisementDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(id);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getWorkModel().equals(workModel)) ||
                (jobAdvUpdate == null && jobAdv.getWorkModel().equals(workModel)))
            return new ErrorResult(MSGs.THE_SAME.get("workModel is"));

        handleLastActions(jobAdv);
        jobAdvertisementUpdateDao.updateWorkModel(workModel, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateWorkTime(String workTime, int id) {
        if (check.notExistsById(jobAdvertisementDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(id);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getWorkTime().equals(workTime)) ||
                (jobAdvUpdate == null && jobAdv.getWorkTime().equals(workTime)))
            return new ErrorResult(MSGs.THE_SAME.get("workTime is"));

        handleLastActions(jobAdv);
        jobAdvertisementUpdateDao.updateWorkTime(workTime, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateOpenPositions(short openPositions, int id) {
        if (check.notExistsById(jobAdvertisementDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(id);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && jobAdvUpdate.getOpenPositions() == openPositions) ||
                (jobAdvUpdate == null && jobAdv.getOpenPositions() == openPositions))
            return new ErrorResult(MSGs.THE_SAME.get("openPositions is"));

        handleLastActions(jobAdv);
        jobAdvertisementUpdateDao.updateOpenPositions(openPositions, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result updateDeadLine(LocalDate deadLine, int id) {
        if (check.notExistsById(jobAdvertisementDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        JobAdvertisement jobAdv = jobAdvertisementDao.getById(id);
        JobAdvertisementUpdate jobAdvUpdate = jobAdv.getJobAdvertisementUpdate();

        if ((jobAdvUpdate != null && check.equals(jobAdvUpdate.getDeadline(), deadLine)) ||
                (jobAdvUpdate == null && check.equals(jobAdv.getDeadline(), deadLine)))
            return new ErrorResult(MSGs.THE_SAME.get("deadline is"));

        handleLastActions(jobAdv);
        jobAdvertisementUpdateDao.updateDeadLine(deadLine, jobAdv.getJobAdvertisementUpdate().getUpdateId());
        return getUpdateResult(jobAdv);
    }

    @Override
    public Result applyUpdates(int jobAdvId) {
        if (check.notExistsById(jobAdvertisementDao, jobAdvId)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));

        JobAdvertisement jobAdvertisement = jobAdvertisementDao.getById(jobAdvId);
        if (jobAdvertisement.getJobAdvertisementUpdate() == null) return new ErrorResult(MSGs.NO_UPDATE.get());

        jobAdvertisementDao.applyUpdates(jobAdvertisement.getJobAdvertisementUpdate(), jobAdvId);
        jobAdvertisementDao.updateUpdateVerification(true, jobAdvId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateActivation(boolean activationStatus, int id) {
        if (check.notExistsById(jobAdvertisementDao, id)) return new ErrorDataResult<>(MSGs.NOT_EXIST.get("id"), false);
        jobAdvertisementDao.updateActivation(activationStatus, id);
        jobAdvertisementDao.updateLastModifiedAt(id, LocalDateTime.now());
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateVerification(boolean verificationStatus, int id) {
        if (check.notExistsById(jobAdvertisementDao, id)) return new ErrorDataResult<>(MSGs.NOT_EXIST.get("id"), false);
        jobAdvertisementDao.updateVerification(verificationStatus, id);
        jobAdvertisementDao.updateRejection(!verificationStatus, id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    private JobAdvertisementUpdate createJobAdvUpdate(JobAdvertisement jobAdv) {
        JobAdvertisementUpdate jobAdvertisementUpdate = modelMapper.map(jobAdv, JobAdvertisementUpdate.class);
        JobAdvertisementUpdate savedJobAdvertisementUpdate = jobAdvertisementUpdateDao.save(jobAdvertisementUpdate);
        jobAdvertisementDao.updateUpdateId(savedJobAdvertisementUpdate.getUpdateId(), jobAdv.getId());
        return savedJobAdvertisementUpdate;
    }

    private void handleLastActions(JobAdvertisement jobAdv) {
        if (jobAdv.getJobAdvertisementUpdate() == null) jobAdv.setJobAdvertisementUpdate(createJobAdvUpdate(jobAdv));
        jobAdvertisementDao.updateUpdateVerification(false, jobAdv.getId());
        jobAdvertisementDao.updateLastModifiedAt(jobAdv.getId(), LocalDateTime.now());
    }

    private SuccessDataResult<Integer> getUpdateResult(JobAdvertisement jobAdv) {
        return new SuccessDataResult<>(MSGs.SUCCESS_UPDATE_REQUEST.get(), jobAdv.getJobAdvertisementUpdate().getUpdateId());
    }

}
