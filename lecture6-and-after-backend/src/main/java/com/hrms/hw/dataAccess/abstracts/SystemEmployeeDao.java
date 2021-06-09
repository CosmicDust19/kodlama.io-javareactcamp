package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.SystemEmployee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemEmployeeDao extends JpaRepository<SystemEmployee,Integer> {
}
