package com.hrms.hw.business.abstracts;

import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.entities.concretes.Position;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PositionService {
    DataResult<List<Position>> getAll();

    Result add(Position position);
}
