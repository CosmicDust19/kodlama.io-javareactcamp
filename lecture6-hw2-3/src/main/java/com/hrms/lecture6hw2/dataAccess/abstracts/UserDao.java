package com.hrms.lecture6hw2.dataAccess.abstracts;

import com.hrms.lecture6hw2.entities.concretes.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDao extends JpaRepository<User,Integer> {
}
