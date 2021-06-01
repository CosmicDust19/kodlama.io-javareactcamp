package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.JobAdvertisementService;
import com.hrms.hw.core.utilities.results.*;
import com.hrms.hw.dataAccess.abstracts.JobAdvertisementDao;
import com.hrms.hw.entities.concretes.City;
import com.hrms.hw.entities.concretes.Employer;
import com.hrms.hw.entities.concretes.JobAdvertisement;
import com.hrms.hw.entities.concretes.Position;
import com.hrms.hw.entities.concretes.dtos.JobAdvertisementAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobAdvertisementManager implements JobAdvertisementService {

    private final JobAdvertisementDao jobAdvertisementDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<JobAdvertisement>> getAll() {
        return new SuccessDataResult<>("All job advertisements have been listed.", jobAdvertisementDao.findAll());
    }

    @Override
    public DataResult<List<JobAdvertisement>> getAllActives() {
        return new SuccessDataResult<>("All active job advertisements have been listed.", jobAdvertisementDao.findAllByActivationStatusTrue());
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
    public DataResult<List<JobAdvertisement>> getByActivationStatusTrueAndEmployer_Id(int employerId) {
        return new SuccessDataResult<>("Success", jobAdvertisementDao.getByActivationStatusTrueAndEmployer_Id(employerId));
    }

    @Override
    public Result add(JobAdvertisementAddDto jobAdvertisementAddDto) {
        JobAdvertisement jobAdvertisement = modelMapper.map(jobAdvertisementAddDto, JobAdvertisement.class);
        jobAdvertisement.setEmployer(new Employer(jobAdvertisementAddDto.getEmployer()));
        jobAdvertisement.setPosition(new Position(jobAdvertisementAddDto.getPosition()));
        jobAdvertisement.setCity(new City(jobAdvertisementAddDto.getCity()));
        jobAdvertisementDao.save(jobAdvertisement);
        return new SuccessResult("Advertisement has been added successfully.");
    }

    @Override
    public Result updateActivationStatus(boolean activationStatus, int jobAdvertisementId) {
        jobAdvertisementDao.updateActivationStatus(activationStatus, jobAdvertisementId);
        return new SuccessResult("Advertisement's activation status has been updated successfully");
    }
}
