package com.hrms.lecture6hw2.business.concretes;

import com.hrms.lecture6hw2.business.abstracts.PositionService;
import com.hrms.lecture6hw2.dataAccess.abstracts.PositionDao;
import com.hrms.lecture6hw2.entities.concretes.Position;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionManager implements PositionService {

    private final PositionDao positionDao;

    @Autowired
    public PositionManager(PositionDao positionDao) {
        this.positionDao = positionDao;
    }

    @Override
    public List<Position> getAll() {
        return positionDao.findAll();
    }
}
