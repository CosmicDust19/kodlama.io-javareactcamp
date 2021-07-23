package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.City;

import java.util.List;

public interface CityService {

    DataResult<List<City>> getAll();

    Result add(String cityName);

}
