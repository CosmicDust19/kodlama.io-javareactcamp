package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.JobAdvertisementService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CityDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.JobAdvertisementDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.PositionDao;
import com.finalproject.hrmsbackend.entities.concretes.City;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.Position;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementAddDto;
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
public class JobAdvertisementManager implements JobAdvertisementService {

    private final JobAdvertisementDao jobAdvertisementDao;
    private final PositionDao positionDao;
    private final CityDao cityDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<JobAdvertisement>> getAll() {
        return new SuccessDataResult<>("All job advertisements have been listed.", jobAdvertisementDao.findAll());
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllActivesAndVerified() {
        return new SuccessDataResult<>("All active job advertisements have been listed.", jobAdvertisementDao.findAllByActivationStatusTrueAndSystemVerificationStatusTrue());
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllActivesAndVerifiedSortedByDate(int sortDirection) {
        Sort sort;
        if (sortDirection < 0) sort = Sort.by(Sort.Direction.DESC, "createdAt");
        else sort = Sort.by(Sort.Direction.ASC, "createdAt");
        return new SuccessDataResult<>("Success", jobAdvertisementDao.findAllByActivationStatusTrueAndSystemVerificationStatusTrue(sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getByActivesAndVerifiedAndEmployer_Id(int employerId) {
        return new SuccessDataResult<>("Success", jobAdvertisementDao.getAllByActivationStatusTrueAndSystemVerificationStatusTrueAndApplicationDeadlineAfterAndEmployer_Id(LocalDate.now(), employerId));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllBySystemVerificationStatusFalse() {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        return new SuccessDataResult<>("Success", jobAdvertisementDao.getAllBySystemVerificationStatusFalse(sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> findAllByActivesAndVerifiedAndApplicationDeadlineFuture() {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        return new SuccessDataResult<>("Success", jobAdvertisementDao.findAllByActivationStatusTrueAndSystemVerificationStatusTrueAndApplicationDeadlineAfterAndEmployer_SystemVerificationStatusTrue(LocalDate.now(),sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> findAllByActivesAndVerifiedAndApplicationDeadlinePast() {
        return new SuccessDataResult<>("Success", jobAdvertisementDao.findAllByActivationStatusTrueAndSystemVerificationStatusTrueAndApplicationDeadlineBefore(LocalDate.now()));
    }

    @Override
    public DataResult<JobAdvertisement> getById(int id) {
        return new SuccessDataResult<>("Success", jobAdvertisementDao.getById(id));
    }

    @Override
    public Result add(JobAdvertisementAddDto jobAdvertisementAddDto) {
        JobAdvertisement jobAdvertisement = modelMapper.map(jobAdvertisementAddDto, JobAdvertisement.class);

        Position position = jobAdvertisement.getPosition();
        position.setTitle(Utils.formName(position.getTitle()));
        if (!Utils.tryToSaveIfNotExists(position, positionDao)) {
            position.setId(positionDao.getByTitle(position.getTitle()).getId());
        }

        City city = jobAdvertisement.getCity();
        city.setName(Utils.formName(city.getName()));
        if (!Utils.tryToSaveIfNotExists(city, cityDao)) {
            city.setId(cityDao.getByName(city.getName()).getId());
        }

        jobAdvertisementDao.save(jobAdvertisement);
        return new SuccessResult("Advertisement has been added successfully.");
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        jobAdvertisementDao.deleteById(id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updatePosition(short positionId, int id) {
        Position position = new Position();
        position.setId(positionId);
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            errors.put("id", "does not exist");
        if (position.getId() <= 0 || !positionDao.existsById(position.getId()))
            errors.put("position", "does not exist");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        JobAdvertisement jobAdvertisement = jobAdvertisementDao.getById(id);
        if (jobAdvertisement.getPosition().getId() == positionId)
            return new ErrorResult("position is the same");
        if (jobAdvertisementDao.existsByEmployerAndPositionAndJobDescriptionAndCity
                (jobAdvertisement.getEmployer(), position, jobAdvertisement.getJobDescription(), jobAdvertisement.getCity()))
            return new ErrorResult("the jobAdvertisement that you want to create is already exists");
        jobAdvertisementDao.updatePosition(position, id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateJobDescription(String jobDescription, int id) {
        if (jobDescription != null) jobDescription = jobDescription.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            errors.put("id", "does not exist");
        if (jobDescription == null || jobDescription.equals(""))
            errors.put("jobDescription", "invalid jobDescription");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        jobAdvertisementDao.updateJobDescription(jobDescription, id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateCity(short cityId, int id) {
        City city = new City();
        city.setId(cityId);
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            errors.put("id", "does not exist");
        if (city.getId() <= 0 || !cityDao.existsById(city.getId()))
            errors.put("city", "city does not exist");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        JobAdvertisement jobAdvertisement = jobAdvertisementDao.getById(id);
        if (jobAdvertisement.getCity().getId() == cityId)
            return new ErrorResult("city is the same");
        if (jobAdvertisementDao.existsByEmployerAndPositionAndJobDescriptionAndCity
                (jobAdvertisement.getEmployer(), jobAdvertisement.getPosition(), jobAdvertisement.getJobDescription(), city))
            return new ErrorResult("the jobAdvertisement that you want to create is already exists");
        jobAdvertisementDao.updateCity(city, id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateMinSalary(Double minSalary, int id) {
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            errors.put("id", "does not exist");
        if (minSalary != null && (minSalary <= 0))
            errors.put("minSalary", "cannot be negative");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        JobAdvertisement jobAdvertisement = jobAdvertisementDao.getById(id);
        if (jobAdvertisement.getMinSalary().equals(minSalary))
            return new ErrorResult("minSalary is the same");
        if (minSalary != null && jobAdvertisement.getMaxSalary() != null && jobAdvertisement.getMaxSalary() < minSalary)
            return new ErrorResult("minSalary cannot be greater than maxSalary");
        jobAdvertisementDao.updateMinSalary(minSalary, id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateMaxSalary(Double maxSalary, int id) {
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            errors.put("id", "does not exist");
        if (maxSalary != null && (maxSalary <= 0))
            errors.put("maxSalary", "cannot be negative");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        JobAdvertisement jobAdvertisement = jobAdvertisementDao.getById(id);
        if (jobAdvertisement.getMaxSalary().equals(maxSalary))
            return new ErrorResult("maxSalary is the same");
        if (maxSalary != null && jobAdvertisement.getMinSalary() != null && jobAdvertisement.getMinSalary() > maxSalary)
            return new ErrorResult("maxSalary cannot be less than minSalary");
        jobAdvertisementDao.updateMaxSalary(maxSalary, id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateWorkModel(String workModel, int id) {
        if (workModel != null) workModel = workModel.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            errors.put("id", "does not exist");
        if (workModel == null || workModel.equals(""))
            errors.put("workModel", "cannot be empty");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        jobAdvertisementDao.updateWorkModel(workModel, id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateWorkTime(String workTime, int id) {
        if (workTime != null) workTime = workTime.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            errors.put("id", "does not exist");
        if (workTime == null || workTime.equals(""))
            errors.put("workModel", "cannot be empty");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        jobAdvertisementDao.updateWorkTime(workTime, id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateApplicationDeadLine(String rowApplicationDeadLine, int id) {
        LocalDate applicationDeadLine;
        try {
            applicationDeadLine = LocalDate.parse(rowApplicationDeadLine);
        } catch (Exception e){
            return new ErrorResult("applicationDeadLine should be this format yyyy-mm-dd");
        }
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            errors.put("id", "does not exist");
        if (applicationDeadLine != null && !applicationDeadLine.isAfter(LocalDate.now()))
            errors.put("applicationDeadLine", "applicationDeadLine should be a date in the future");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        jobAdvertisementDao.updateApplicationDeadLine(applicationDeadLine, id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateActivationStatus(boolean activationStatus, int id) {
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        jobAdvertisementDao.updateActivationStatus(activationStatus, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateSystemVerificationStatus(boolean systemVerificationStatus, int id) {
        if (id <= 0 || !jobAdvertisementDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        jobAdvertisementDao.updateSystemVerificationStatus(systemVerificationStatus, id);
        jobAdvertisementDao.updateSystemRejectionStatus(!systemVerificationStatus, id);
        return new SuccessResult("Success");
    }

}
