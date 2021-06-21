package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateService;
import com.finalproject.hrmsbackend.core.abstracts.EmailService;
import com.finalproject.hrmsbackend.core.adapters.MernisServiceAdapter;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.entities.concretes.Candidate;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateManager implements CandidateService {

    private final CandidateDao candidateDao;
    private final MernisServiceAdapter mernisServiceAdapter;
    private final EmailService emailService;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<Candidate>> getAll() {
        return new SuccessDataResult<>("Success", candidateDao.findAll());
    }

    @Override
    public Result add(CandidateAddDto candidateAddDto) {
        if (!mernisServiceAdapter.isRealPerson(candidateAddDto.getNationalityId(),
                candidateAddDto.getFirstName(), candidateAddDto.getLastName(), candidateAddDto.getBirthYear()))
            return new ErrorResult("mernis verification failed");
        else if (!candidateAddDto.getPassword().equals(candidateAddDto.getPasswordRepeat()))
            return new ErrorResult("password repetition mismatch");
        Candidate candidate = modelMapper.map(candidateAddDto, Candidate.class);
        emailService.sendVerificationMail(candidateAddDto.getEmail());
        candidateDao.save(candidate);
        return new SuccessResult("Email verified...  Candidate Saved.");
    }
}
