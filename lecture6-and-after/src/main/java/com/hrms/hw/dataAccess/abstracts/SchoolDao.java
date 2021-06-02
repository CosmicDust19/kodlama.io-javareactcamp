package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.School;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolDao extends JpaRepository<School, Integer> {
}
