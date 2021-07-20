package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LanguageDao extends JpaRepository<Language, Short> {

}
