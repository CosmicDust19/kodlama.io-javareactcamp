package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CandidateService;
import com.hrms.hw.core.abstracts.EmailService;
import com.hrms.hw.core.adapters.MernisServiceAdapter;
import com.hrms.hw.core.utilities.results.*;
import com.hrms.hw.dataAccess.abstracts.CandidateDao;
import com.hrms.hw.entities.concretes.Candidate;
import com.hrms.hw.entities.concretes.dtos.CandidateAddDto;
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
                candidateAddDto.getFirstName(), candidateAddDto.getLastName(), candidateAddDto.getBirthYear())) {
            return new ErrorResult("Mernis verification failed.");
        } else if (!candidateAddDto.getPassword().equals(candidateAddDto.getPasswordRepeat())) {
            return new ErrorResult("Password repetition mismatch.");
        }

        Candidate candidate = modelMapper.map(candidateAddDto, Candidate.class);
        emailService.sendVerificationMail(candidateAddDto.getEmail());

        try {
            candidateDao.save(candidate);
            return new SuccessResult("Email verified...  Candidate Saved.");
        } catch (Exception exception) {
            exception.printStackTrace();
            return new ErrorResult("An Error Has Occurred - Registration Failed");
        }

    }
}
