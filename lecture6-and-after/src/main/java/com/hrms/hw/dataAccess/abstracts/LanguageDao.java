package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageDao extends JpaRepository<Language, Integer> {
}
