package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CityService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CityDao;
import com.finalproject.hrmsbackend.entities.concretes.City;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityManager implements CityService {

    private final CityDao cityDao;
    private final CheckService check;

    @Override
    public DataResult<List<City>> getAll() {
        return new SuccessDataResult<>(cityDao.findAll());
    }

    @Override
    public Result add(String cityName) {
        cityDao.save(new City(cityName));
        return new SuccessResult(MSGs.SAVED.get());
    }

}
