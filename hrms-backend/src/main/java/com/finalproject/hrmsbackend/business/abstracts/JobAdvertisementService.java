package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementAddDto;

import java.util.List;

public interface JobAdvertisementService {

    DataResult<List<JobAdvertisement>> getAll();

    DataResult<List<JobAdvertisement>> getAllActivesAndVerified();

    DataResult<List<JobAdvertisement>> getAllActivesAndVerifiedSortedByDate(int sortDirection);

    DataResult<List<JobAdvertisement>> getByActivesAndVerifiedAndEmployer_Id(int employerId);

    DataResult<List<JobAdvertisement>> getAllBySystemVerificationStatusFalse();

    DataResult<List<JobAdvertisement>> findAllByActivesAndVerifiedAndApplicationDeadlineFuture();

    DataResult<List<JobAdvertisement>> findAllByActivesAndVerifiedAndApplicationDeadlinePast();

    DataResult<JobAdvertisement> getById(int jobAdvertisementId);

    Result add(JobAdvertisementAddDto jobAdvertisementAddDto);

    DataResult<Boolean> deleteById(int id);

    Result updatePosition(short positionId, int id);

    Result updateJobDescription(String jobDescription, int id);

    Result updateCity(short cityId, int id);

    Result updateMinSalary(Double minSalary, int id);

    Result updateMaxSalary(Double maxSalary, int id);

    Result updateWorkModel(String workModel, int id);

    Result updateWorkTime(String workTime, int id);

    Result updateApplicationDeadLine(String applicationDeadLine, int id);

    Result updateActivationStatus(boolean isActive, int id);

    Result updateSystemVerificationStatus(boolean systemVerificationStatus, int id);
}
