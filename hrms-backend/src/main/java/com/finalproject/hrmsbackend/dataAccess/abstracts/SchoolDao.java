package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolDao extends JpaRepository<School, Integer> {

}
