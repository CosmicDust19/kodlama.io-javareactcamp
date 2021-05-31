package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.PositionService;
import com.hrms.hw.core.utilities.results.*;
import com.hrms.hw.dataAccess.abstracts.PositionDao;
import com.hrms.hw.entities.concretes.Position;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PositionManager implements PositionService {

    private final PositionDao positionDao;

    @Autowired
    public PositionManager(PositionDao positionDao) {
        this.positionDao = positionDao;
    }

    @Override
    public DataResult<List<Position>> getAll() {
        return new SuccessDataResult<>("Success", positionDao.findAll());
    }

    @Override
    public Result add(Position position) {

        try {
            position.setCreatedAt(LocalDate.now());
            positionDao.save(position);
            return new SuccessResult("Position Saved");
        } catch (Exception exception){
            exception.printStackTrace();
            return new ErrorResult("Registration Failed");
        }

    }


}
