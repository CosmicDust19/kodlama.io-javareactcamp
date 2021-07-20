package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.PositionService;
import com.finalproject.hrmsbackend.core.business.CheckService;
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
    public Result add(Position position) {
        if (position.getTitle() != null) position.setTitle(position.getTitle().trim());
        if (check.invalidLength(position.getTitle(), 0, 100)) return new ErrorResult(MSGs.INVALID.get("positionTitle"));
        positionDao.save(position);
        return new SuccessResult(MSGs.SAVED.get());
    }
}
