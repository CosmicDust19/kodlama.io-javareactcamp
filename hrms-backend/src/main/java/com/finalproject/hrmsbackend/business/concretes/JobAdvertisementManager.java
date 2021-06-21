package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.JobAdvertisementService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.core.utilities.results.SuccessDataResult;
import com.finalproject.hrmsbackend.core.utilities.results.SuccessResult;
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

import java.util.List;

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
    public DataResult<JobAdvertisement> getById(int jobAdvertisementId){
        return new SuccessDataResult<>("Success", jobAdvertisementDao.getById(jobAdvertisementId));
    }

    @Override
    public Result add(JobAdvertisementAddDto jobAdvertisementAddDto) {
        JobAdvertisement jobAdvertisement = modelMapper.map(jobAdvertisementAddDto, JobAdvertisement.class);

        Position position = jobAdvertisement.getPosition();
        position.setTitle(Utils.formName(position.getTitle()));
        if (!Utils.tryToSaveIfNotExists(position, positionDao)){
            position.setId(positionDao.getByTitle(position.getTitle()).getId());
        }

        City city = jobAdvertisement.getCity();
        city.setName(Utils.formName(city.getName()));
        if (!Utils.tryToSaveIfNotExists(city, cityDao)){
            city.setId(cityDao.getByName(city.getName()).getId());
        }

        jobAdvertisementDao.save(jobAdvertisement);
        return new SuccessResult("Advertisement has been added successfully.");
    }

    @Override
    public Result updateActivationStatus(boolean activationStatus, int jobAdvertisementId) {
        jobAdvertisementDao.updateActivationStatus(activationStatus, jobAdvertisementId);
        return new SuccessResult("Advertisement's activation status has been updated successfully");
    }
}
