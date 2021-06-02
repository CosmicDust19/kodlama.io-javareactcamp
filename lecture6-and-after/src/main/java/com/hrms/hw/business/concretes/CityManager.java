package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CityService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.CityDao;
import com.hrms.hw.entities.concretes.City;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityManager implements CityService {

    private final CityDao cityDao;

    @Override
    public DataResult<List<City>> getAll(){
        return new SuccessDataResult<>("Success", cityDao.findAll());
    }

    @Override
    public Result add(City city) {
        cityDao.save(city);
        return new SuccessResult("Success");
    }
}
