package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CandidateCheckService;
import com.hrms.hw.business.abstracts.CandidateService;
import com.hrms.hw.core.abstracts.EmailService;
import com.hrms.hw.core.adapters.MernisServiceAdapter;
import com.hrms.hw.core.utilities.results.*;
import com.hrms.hw.dataAccess.abstracts.CandidateDao;
import com.hrms.hw.entities.concretes.Candidate;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CandidateManager implements CandidateService {

    private final CandidateDao candidateDao;
    private final CandidateCheckService candidateCheckService;
    private final MernisServiceAdapter mernisServiceAdapter;
    private final EmailService emailService;

    @Override
    public DataResult<List<Candidate>> getAll() {
        return new SuccessDataResult<>("Success", candidateDao.findAll());
    }

    public Result register(Candidate candidate, String passwordRepeat){

        if(!candidateCheckService.areAllFieldsFilled(candidate)){
            return new ErrorResult("There is empty fields!");
        } else if(!candidate.getPassword().equals(passwordRepeat)){
            return new ErrorResult("Password repetition mismatch");
        } else if (mernisServiceAdapter.isNatIdReal(candidate.getNationalityId(),
                candidate.getFirstName(), candidate.getLastName(), candidate.getBirthYear())){
            return new ErrorResult("Incompatible Nationality ID, Name, Surname And Birth Year!");
        }

        try {
            emailService.sendVerificationMail(candidate.getEmail());
            candidateDao.save(candidate);
            return new SuccessResult("Email verified...\nCandidate Saved.");
        } catch (Exception exception){
            exception.printStackTrace();
            return new ErrorResult("An Error Has Occurred - Registration Failed");
        }

    }
}
