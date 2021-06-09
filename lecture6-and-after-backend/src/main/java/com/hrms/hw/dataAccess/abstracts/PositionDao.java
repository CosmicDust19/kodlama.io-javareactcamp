package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.Position;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionDao extends JpaRepository<Position, Short> {
    Position getByTitle(String title);
}

