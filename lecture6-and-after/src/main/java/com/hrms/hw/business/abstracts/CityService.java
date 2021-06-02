package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.City;

import java.util.List;

public interface CityService {
    DataResult<List<City>> getAll();

    Result add(City city);
}
