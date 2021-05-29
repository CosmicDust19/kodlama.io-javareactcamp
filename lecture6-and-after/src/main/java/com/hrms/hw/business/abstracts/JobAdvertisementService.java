package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.JobAdvertisement;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface JobAdvertisementService {

    DataResult<List<JobAdvertisement>> getAll();

    DataResult<List<JobAdvertisement>> getAllActives();

    DataResult<List<JobAdvertisement>> getAllActivesSortedByDate(int sortDirection);

    DataResult<List<JobAdvertisement>> getByActiveTrueAndEmployer_Id(int employerId);

    Result add(JobAdvertisement jobAdvertisement);

    Result updateActivationStatus(boolean isActive, int id);
}
