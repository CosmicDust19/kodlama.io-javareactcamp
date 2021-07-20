package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementAddDto;

import java.time.LocalDate;
import java.util.List;

public interface JobAdvertisementService {

    DataResult<List<JobAdvertisement>> getAll();

    DataResult<List<JobAdvertisement>> getAllActiveVerified();

    DataResult<List<JobAdvertisement>> getAllActiveVerifiedByDate(Short sortDirection);

    DataResult<List<JobAdvertisement>> getAllPublicByEmployer(int employerId);

    DataResult<List<JobAdvertisement>> getAllUnverified(Short sortDirection);

    DataResult<List<JobAdvertisement>> getAllPublic(Short sortDirection);

    DataResult<List<JobAdvertisement>> getAllActiveVerifiedPast();

    DataResult<JobAdvertisement> getById(int jobAdvertisementId);

    Result add(JobAdvertisementAddDto jobAdvertisementAddDto);

    DataResult<Boolean> deleteById(int id);

    Result updatePosition(short positionId, int id);

    Result updateJobDesc(String jobDescription, int id);

    Result updateCity(short cityId, int id);

    Result updateMinSalary(Double minSalary, int id);

    Result updateMaxSalary(Double maxSalary, int id);

    Result updateWorkModel(String workModel, int id);

    Result updateWorkTime(String workTime, int id);

    Result updateOpenPositions(short num, int id);

    Result updateDeadLine(LocalDate deadLine, int id);

    Result applyUpdates(int jobAdvId);

    Result updateActivation(boolean isActive, int id);

    Result updateVerification(boolean systemVerificationStatus, int id);

}
