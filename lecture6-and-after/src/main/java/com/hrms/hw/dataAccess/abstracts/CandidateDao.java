package com.hrms.hw.dataAccess.abstracts;


import com.hrms.hw.entities.concretes.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateDao extends JpaRepository<Candidate,Integer> {
}
