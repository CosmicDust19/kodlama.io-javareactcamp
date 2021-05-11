package com.hrms.lecture6hw2.dataAccess.abstracts;

import com.hrms.lecture6hw2.entities.concretes.SystemStaff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemStaffDao extends JpaRepository<SystemStaff,Integer> {
}
