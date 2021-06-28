package com.finalproject.hrmsbackend.core.dataAccess;

import com.finalproject.hrmsbackend.core.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDao extends JpaRepository<User,Integer> {
    boolean existsByEmail(String email);
}
