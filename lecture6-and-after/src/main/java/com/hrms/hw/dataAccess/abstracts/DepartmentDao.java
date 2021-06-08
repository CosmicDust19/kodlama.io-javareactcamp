package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentDao extends JpaRepository<Department, Short> {
    Department getByName(String name);
}
