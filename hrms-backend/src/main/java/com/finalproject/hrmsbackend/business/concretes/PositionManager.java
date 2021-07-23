package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.PositionService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.PositionDao;
import com.finalproject.hrmsbackend.entities.concretes.Position;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionManager implements PositionService {

    private final PositionDao positionDao;
    private final CheckService check;

    @Override
    public DataResult<List<Position>> getAll() {
        return new SuccessDataResult<>(positionDao.findAll());
    }

    @Override
    public Result add(String positionTitle) {
        positionDao.save(new Position(positionTitle));
        return new SuccessResult(MSGs.SAVED.get());
    }
}
