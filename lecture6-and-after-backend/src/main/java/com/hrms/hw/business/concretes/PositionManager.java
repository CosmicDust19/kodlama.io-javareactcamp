package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.PositionService;
import com.hrms.hw.core.utilities.results.*;
import com.hrms.hw.dataAccess.abstracts.PositionDao;
import com.hrms.hw.entities.concretes.Position;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionManager implements PositionService {

    private final PositionDao positionDao;

    @Override
    public DataResult<List<Position>> getAll() {
        return new SuccessDataResult<>("Success", positionDao.findAll());
    }

    @Override
    public Result add(Position position) {
        positionDao.save(position);
        return new SuccessResult("Success");
    }
}
