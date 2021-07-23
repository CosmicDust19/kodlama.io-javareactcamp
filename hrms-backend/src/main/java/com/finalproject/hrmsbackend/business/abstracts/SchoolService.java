package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.School;

import java.util.List;

public interface SchoolService {

    DataResult<List<School>> getAll();

    Result add(String schoolName);

}
