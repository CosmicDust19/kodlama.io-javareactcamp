package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateCvService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.*;
import com.finalproject.hrmsbackend.entities.concretes.*;
import com.finalproject.hrmsbackend.entities.concretes.dtos.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CandidateCvManager implements CandidateCvService {

    private final CandidateDao candidateDao;
    private final CandidateCvDao candidateCvDao;
    private final CandidateJobExperienceDao candidateJobExperienceDao;
    private final CandidateLanguageDao candidateLanguageDao;
    private final CandidateSchoolDao candidateSchoolDao;
    private final CandidateSkillDao candidateSkillDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<CandidateCv>> getAll() {
        return new SuccessDataResult<>("Success", candidateCvDao.findAll());
    }

    @Override
    public Result add(CandidateCvAddDto candidateCvAddDto) {
        CandidateCv candidateCv = modelMapper.map(candidateCvAddDto, CandidateCv.class);

        Map<String, String> errors = new HashMap<>();

        if (!candidateDao.existsById(candidateCv.getCandidate().getId()))
            errors.put("candidateId", "id does not exists");
        if (candidateCvDao.existsByTitle(candidateCv.getTitle())) errors.put("title", "used before");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);

        //to avoid null pointer exception
        List<CandidateJobExperience> candidateJobExperiences = candidateCv.getCandidateJobExperiences() != null ? candidateCv.getCandidateJobExperiences() : new ArrayList<>();
        List<CandidateLanguage> candidateLanguages = candidateCv.getCandidateLanguages() != null ? candidateCv.getCandidateLanguages() : new ArrayList<>();
        List<CandidateSchool> candidateSchools = candidateCv.getCandidateSchools() != null ? candidateCv.getCandidateSchools() : new ArrayList<>();
        List<CandidateSkill> candidateSkills = candidateCv.getCandidateSkills() != null ? candidateCv.getCandidateSkills() : new ArrayList<>();

        //set candidateIds
        candidateJobExperiences.forEach((candidateJobExperience) -> candidateJobExperience.setId(candidateCv.getCandidate().getId()));
        candidateLanguages.forEach((candidateLanguage) -> candidateLanguage.setId(candidateCv.getCandidate().getId()));
        candidateSchools.forEach((candidateSchool) -> candidateSchool.setId(candidateCv.getCandidate().getId()));
        candidateSkills.forEach((candidateSkill) -> candidateSkill.setId(candidateCv.getCandidate().getId()));

        //save if not exists
        candidateJobExperiences.forEach(candidateJobExperience -> {
            if (!Utils.tryToSaveIfNotExists(candidateJobExperience, candidateJobExperienceDao))
                candidateJobExperience.setId(candidateJobExperienceDao.getByCandidateAndWorkPlaceAndPosition(candidateJobExperience.getCandidate(), candidateJobExperience.getWorkPlace(), candidateJobExperience.getPosition()).getId());
        });
        candidateLanguages.forEach(candidateLanguage -> {
            if (!Utils.tryToSaveIfNotExists(candidateLanguage, candidateLanguageDao))
                candidateLanguage.setId(candidateLanguageDao.getByCandidateAndLanguage(candidateLanguage.getCandidate(), candidateLanguage.getLanguage()).getId());

        });
        candidateSchools.forEach(candidateSchool -> {
            if (!Utils.tryToSaveIfNotExists(candidateSchool, candidateSchoolDao))
                candidateSchool.setId(candidateSchoolDao.getByCandidateAndSchoolAndDepartment(candidateSchool.getCandidate(), candidateSchool.getSchool(), candidateSchool.getDepartment()).getId());
        });
        candidateSkills.forEach(candidateSkill -> {
            if (!Utils.tryToSaveIfNotExists(candidateSkill, candidateSkillDao))
                candidateSkill.setId(candidateSkillDao.getByCandidateAndSkill(candidateSkill.getCandidate(), candidateSkill.getSkill()).getId());
        });

        try {
            candidateCvDao.save(candidateCv);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            return new ErrorResult("an unknown error has occurred");
        }

        return new SuccessResult("Success");
    }


}
