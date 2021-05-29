package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.JobAdvertisementService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.JobAdvertisementDao;
import com.hrms.hw.entities.concretes.JobAdvertisement;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class JobAdvertisementManager implements JobAdvertisementService {

    private final JobAdvertisementDao jobAdvertisementDao;

    @Override
    public DataResult<List<JobAdvertisement>> getAll() {
        return new SuccessDataResult<>("All job advertisements have been listed.", jobAdvertisementDao.findAll());
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllActives() {
        return new SuccessDataResult<>("Job Advertisements Have Listed.", jobAdvertisementDao.findAllByActivationStatusTrue());
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllActivesSortedByDate(int sortDirection) {
        Sort sort;
        if (sortDirection < 0) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        } else {
            sort = Sort.by(Sort.Direction.ASC, "createdAt");
        }
        return new SuccessDataResult<>("Job Advertisements Have Sorted By Date.", jobAdvertisementDao.findAllByActivationStatusTrue(sort));
    }

    @Override
    public DataResult<List<JobAdvertisement>> getByActiveTrueAndEmployer_Id(int employerId) {
        return new SuccessDataResult<>("Success", jobAdvertisementDao.getByActivationStatusTrueAndEmployer_Id(employerId));
    }

    @Override
    public Result add(JobAdvertisement jobAdvertisement) {
        jobAdvertisementDao.save(jobAdvertisement);
        return new SuccessResult("Advertisement has been added successfully.");
    }

    @Override
    public Result updateActivationStatus(boolean isActive, int jobAdvertisementId) {
        jobAdvertisementDao.updateActivationStatus(isActive, jobAdvertisementId);
        return new SuccessResult("Advertisement's activation status has been updated successfully");
    }

}
