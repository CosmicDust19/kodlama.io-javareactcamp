package com.hrms.hw.dataAccess.abstracts;

import com.hrms.hw.entities.concretes.CandidateCv;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateCvDao extends JpaRepository<CandidateCv, Integer> {
}
