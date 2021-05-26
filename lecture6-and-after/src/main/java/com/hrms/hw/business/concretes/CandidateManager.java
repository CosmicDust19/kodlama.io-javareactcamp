package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CandidateCheckService;
import com.hrms.hw.business.abstracts.CandidateService;
import com.hrms.hw.core.abstracts.EmailService;
import com.hrms.hw.core.adapters.MernisServiceAdapter;
import com.hrms.hw.core.utilities.results.*;
import com.hrms.hw.dataAccess.abstracts.CandidateDao;
import com.hrms.hw.entities.concretes.Candidate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CandidateManager implements CandidateService {

    private final CandidateDao candidateDao;
    private final CandidateCheckService candidateCheckService;
    private final MernisServiceAdapter mernisServiceAdapter;
    private final EmailService emailService;

    @Autowired
    public CandidateManager(CandidateDao candidateDao, CandidateCheckService candidateCheckService, MernisServiceAdapter mernisServiceAdapter, EmailService emailService) {
        this.candidateDao = candidateDao;
        this.candidateCheckService = candidateCheckService;
        this.mernisServiceAdapter = mernisServiceAdapter;
        this.emailService = emailService;
    }

    @Override
    public DataResult<List<Candidate>> getAll() {
        return new SuccessDataResult<>("Success", candidateDao.findAll());
    }

    public Result add(Candidate candidate){

        if(!candidateCheckService.areAllFieldsFilled(candidate)){
            return new ErrorResult("There is empty fields!");
        } else if (mernisServiceAdapter.isNatIdReal(candidate.getNationalityId(),
                candidate.getFirstName(), candidate.getLastName(), candidate.getBirthYear())){
            return new ErrorResult("Incompatible Nationality ID, Name, Surname, Birth Year!");
        }

        try {
            candidateDao.save(candidate);
            emailService.sendVerificationMail(candidate.getEmail());
            return new SuccessResult("Candidate Saved");
        } catch (Exception exception){
            exception.printStackTrace();
            return new ErrorResult("Registration Failed");
        }

    }
}
