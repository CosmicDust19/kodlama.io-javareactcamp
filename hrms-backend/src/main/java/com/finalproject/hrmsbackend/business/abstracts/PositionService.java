package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Position;

import java.util.List;

public interface PositionService {

    DataResult<List<Position>> getAll();

    Result add(String positionTitle);

}
