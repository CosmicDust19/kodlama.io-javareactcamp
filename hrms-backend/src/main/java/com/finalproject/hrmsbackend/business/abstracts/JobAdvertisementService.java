package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementDto;

import java.time.LocalDate;
import java.util.List;

public interface JobAdvertisementService {

    DataResult<List<JobAdvertisement>> getAll(Short sortDirection, String propName);

    DataResult<List<JobAdvertisement>> getAllByEmployer(Integer employerId);

    DataResult<List<JobAdvertisement>> getActiveVerified();

    DataResult<List<JobAdvertisement>> getActiveVerifiedByCreatedAt(Short sortDirection);

    DataResult<List<JobAdvertisement>> getPublicByEmployer(int employerId, Short sortDirection, String propName);

    DataResult<List<JobAdvertisement>> getUnverified(Short sortDirection);

    DataResult<List<JobAdvertisement>> getPublic(Short sortDirection, String propName);

    DataResult<List<JobAdvertisement>> getActiveVerifiedPast();

    DataResult<JobAdvertisement> getById(int jobAdvId);

    Result add(JobAdvertisementDto jobAdvertisementDto);

    DataResult<Boolean> deleteById(int jobAdvId);

    Result update(JobAdvertisementDto jobAdvAddDto);

    Result updatePosition(short positionId, int jobAdvId);

    Result updateJobDesc(String jobDescription, int jobAdvId);

    Result updateCity(short cityId, int jobAdvId);

    Result updateMinSalary(Double minSalary, int jobAdvId);

    Result updateMaxSalary(Double maxSalary, int jobAdvId);

    Result updateWorkModel(String workModel, int jobAdvId);

    Result updateWorkTime(String workTime, int jobAdvId);

    Result updateOpenPositions(short num, int jobAdvId);

    Result updateDeadLine(LocalDate deadLine, int id);

    Result applyChanges(int jobAdvId);

    Result updateActivation(boolean isActive, int id);

    Result updateVerification(boolean systemVerificationStatus, int id);

}
