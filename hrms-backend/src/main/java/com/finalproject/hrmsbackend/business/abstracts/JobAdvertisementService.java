package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementAddDto;

import java.util.List;

public interface JobAdvertisementService {

    DataResult<List<JobAdvertisement>> getAll();

    DataResult<List<JobAdvertisement>> getAllActives();

    DataResult<List<JobAdvertisement>> getAllActivesSortedByDate(int sortDirection);

    DataResult<List<JobAdvertisement>> getByActivationStatusTrueAndEmployer_Id(int employerId);

    DataResult<JobAdvertisement> getById(int jobAdvertisementId);

    Result add(JobAdvertisementAddDto jobAdvertisementAddDto);

    Result updateActivationStatus(boolean isActive, int id);
}
