package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CityService;
import com.finalproject.hrmsbackend.core.business.CheckService;
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
    public Result add(City city) {
        if (city.getName() != null) city.setName(city.getName().trim());
        if (check.invalidLength(city.getName(), 0, 50)) return new ErrorResult(MSGs.INVALID.get("cityName"));
        cityDao.save(city);
        return new SuccessResult(MSGs.SAVED.get());
    }
}
