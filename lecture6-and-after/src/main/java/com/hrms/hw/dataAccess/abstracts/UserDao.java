package com.hrms.hw.dataAccess.abstracts;


import com.hrms.hw.core.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDao extends JpaRepository<User,Integer> {
}
