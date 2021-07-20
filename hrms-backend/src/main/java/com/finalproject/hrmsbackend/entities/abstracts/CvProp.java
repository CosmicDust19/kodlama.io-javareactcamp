package com.finalproject.hrmsbackend.entities.abstracts;

import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;

public interface CvProp extends BaseEntity<Integer> {

    Candidate getCandidate();

    void setCandidate(Candidate candidate);

}
