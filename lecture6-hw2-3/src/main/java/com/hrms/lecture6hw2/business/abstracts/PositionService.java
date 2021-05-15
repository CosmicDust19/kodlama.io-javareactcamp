package com.hrms.lecture6hw2.business.abstracts;

import com.hrms.lecture6hw2.entities.concretes.Position;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PositionService {
    List<Position> getAll();
}
