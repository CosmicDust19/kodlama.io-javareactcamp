package com.finalproject.hrmsbackend.business.abstracts.check;

import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisementUpdate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.JobAdvertisementDto;
import lombok.SneakyThrows;

import java.util.Map;

public interface JobAdvertisementCheckService extends BaseCheckService {

    Map<String, String> getErrors();

    void existsJobAdvertById(Integer jobAdvertId);

    void checkIfViolatesUkUpdate(JobAdvertisementDto jobAdvertDto, JobAdvertisementUpdate jobAdvertUpdate);

    @SneakyThrows
    void checkIfViolatesUkAdd(JobAdvertisementDto jobAdvDto);

    boolean changed(JobAdvertisement jobAdvert, JobAdvertisementUpdate jobAdvertUpdate);

}
