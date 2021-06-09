package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.JobAdvertisement;
import com.hrms.hw.entities.concretes.dtos.JobAdvertisementAddDto;

import java.util.List;

public interface JobAdvertisementService {

    DataResult<List<JobAdvertisement>> getAll();

    DataResult<List<JobAdvertisement>> getAllActives();

    DataResult<List<JobAdvertisement>> getAllActivesSortedByDate(int sortDirection);

    DataResult<List<JobAdvertisement>> getByActivationStatusTrueAndEmployer_Id(int employerId);

    Result add(JobAdvertisementAddDto jobAdvertisementAddDto);

    Result updateActivationStatus(boolean isActive, int id);
}
