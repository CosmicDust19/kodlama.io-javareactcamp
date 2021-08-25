package com.finalproject.hrmsbackend.core.adapters.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;

public interface MernisService {

    boolean realPerson(CandidateAddDto dto);

}
