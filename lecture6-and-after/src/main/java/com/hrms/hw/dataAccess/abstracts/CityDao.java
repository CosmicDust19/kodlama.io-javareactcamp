package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityDao extends JpaRepository<City, Integer> {
}
