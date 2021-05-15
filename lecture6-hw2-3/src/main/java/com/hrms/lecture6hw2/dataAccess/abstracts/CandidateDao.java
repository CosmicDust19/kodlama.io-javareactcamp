package com.hrms.lecture6hw2.dataAccess.abstracts;

import com.hrms.lecture6hw2.entities.concretes.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateDao extends JpaRepository<Candidate,Integer> {
}
