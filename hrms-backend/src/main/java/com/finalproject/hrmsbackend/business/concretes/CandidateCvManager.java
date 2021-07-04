package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateCvService;
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
    public DataResult<CandidateCv> getById(int id) {
        if (id <= 0 || !candidateCvDao.existsById(id)) {
            return new ErrorDataResult<>("id does not exist");
        }
        return new SuccessDataResult<>("Success", candidateCvDao.getById(id));
    }

    @Override
    public Result add(CandidateCvAddDto candidateCvAddDto) {

        if (candidateCvAddDto.getCandidateId() <= 0 || !candidateDao.existsById(candidateCvAddDto.getCandidateId()))
            return new ErrorResult("candidateId: does not exist");

        //first step
        Map<String, String> errors = new HashMap<>();
        CandidateCv candidateCv = modelMapper.map(candidateCvAddDto, CandidateCv.class);
        if (candidateCv.getTitle() != null) candidateCv.setTitle(candidateCv.getTitle().trim());
        if (candidateCv.getCoverLetter() != null) candidateCv.setCoverLetter(candidateCv.getCoverLetter().trim());
        if (candidateCv.getTitle() == null || candidateCv.getTitle().length() == 0 ||
                candidateCvDao.existsByTitleAndCandidate(candidateCv.getTitle(), candidateCv.getCandidate()))
            errors.put("title", "used before");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);

        //gather property ids that will be saved
        List<CandidateJobExperience> candidateJobExperiences = candidateCv.getCandidateJobExperiences();
        List<Integer> candidateJobExperienceIds = new ArrayList<>();
        if (candidateJobExperiences != null) {
            for (CandidateJobExperience candidateJobExperience : candidateJobExperiences) {
                if (candidateJobExperience == null) continue;
                candidateJobExperienceIds.add(candidateJobExperience.getId());
            }
        }
        List<CandidateLanguage> candidateLanguages = candidateCv.getCandidateLanguages();
        List<Integer> candidateLanguageIds = new ArrayList<>();
        if (candidateCv.getCandidateLanguages() != null) {
            for (CandidateLanguage candidateLanguage : candidateLanguages) {
                if (candidateLanguage == null) continue;
                candidateLanguageIds.add(candidateLanguage.getId());
            }
        }
        List<CandidateSchool> candidateSchools = candidateCv.getCandidateSchools();
        List<Integer> candidateSchoolIds = new ArrayList<>();
        if (candidateCv.getCandidateSchools() != null) {
            for (CandidateSchool candidateSchool : candidateSchools) {
                if (candidateSchool == null) continue;
                candidateSchoolIds.add(candidateSchool.getId());
            }
        }
        List<CandidateSkill> candidateSkills = candidateCv.getCandidateSkills();
        List<Integer> candidateSkillIds = new ArrayList<>();
        if (candidateCv.getCandidateSkills() != null) {
            for (CandidateSkill candidateSkill : candidateSkills) {
                if (candidateSkill == null) continue;
                candidateSkillIds.add(candidateSkill.getId());
            }
        }

        //save raw cv after we gather property ids
        candidateCv.setCandidateJobExperiences(new ArrayList<>());
        candidateCv.setCandidateLanguages(new ArrayList<>());
        candidateCv.setCandidateSchools(new ArrayList<>());
        candidateCv.setCandidateSkills(new ArrayList<>());
        CandidateCv savedCandidateCv = candidateCvDao.save(candidateCv);

        //save properties and return results
        Map<String, Result> results = new HashMap<>();
        if (candidateJobExperienceIds.size() != 0)
            results.put("candidateJobExperiences", addJobExperiencesToCandidateCv(candidateJobExperienceIds, savedCandidateCv.getId(), (byte) 1));
        if (candidateLanguageIds.size() != 0)
            results.put("candidateLanguages", addLanguagesToCandidateCv(candidateLanguageIds, savedCandidateCv.getId(), (byte) 1));
        if (candidateSchoolIds.size() != 0)
            results.put("candidateSchools", addSchoolsToCandidateCv(candidateSchoolIds, savedCandidateCv.getId(), (byte) 1));
        if (candidateSkillIds.size() != 0)
            results.put("candidateSkills", addSkillsToCandidateCv(candidateSkillIds, savedCandidateCv.getId(), (byte) 1));
        return new SuccessDataResult<>(Integer.toString(savedCandidateCv.getId()), results);
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        if (id <= 0 || !candidateCvDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        candidateCvDao.deleteById(id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateTitle(String title, int id) {
        if (title != null) title = title.trim();
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateCvDao.existsById(id))
            errors.put("id", "does not exist");
        if (title == null || title.length() == 0)
            errors.put("title", "invalid title");
        if (!errors.isEmpty())
            return new ErrorDataResult<>("Error", errors);
        if (candidateCvDao.existsByTitleAndCandidate(title, candidateCvDao.getById(id).getCandidate()))
            return new ErrorResult("title: used before");
        candidateCvDao.updateTitle(title, id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateCoverLetter(String coverLetter, int id) {
        if (coverLetter != null) {
            coverLetter = coverLetter.trim();
            if (coverLetter.length() == 0) coverLetter = null;
        }
        if (id <= 0 || !candidateCvDao.existsById(id))
            return new ErrorDataResult<>("id: does not exist");
        candidateCvDao.updateCoverLetter(coverLetter, id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result syncCandidateCvJobExperiences(List<Integer> candidateJobExperienceIds, int candidateCvId) {
        if (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId))
            return new ErrorResult("candidateCvId: does not exist");
        CandidateCv candidateCv = candidateCvDao.getById(candidateCvId);
        List<Integer> currentCandidateJobExperienceIds = new ArrayList<>();
        candidateCv.getCandidateJobExperiences().forEach(candidateJobExperience -> currentCandidateJobExperienceIds.add(candidateJobExperience.getId()));
        deleteJobExperiencesFromCandidateCv(currentCandidateJobExperienceIds, candidateCvId, (byte) 1);
        if (candidateJobExperienceIds != null && candidateJobExperienceIds.get(0) != null && candidateJobExperienceIds.get(0) != -1) {
            Result result = addJobExperiencesToCandidateCv(candidateJobExperienceIds, candidateCvId, (byte) 0);
            return new SuccessDataResult<>("Add results:", result);
        }
        return new SuccessResult("Success");
    }

    @Override
    public Result syncCandidateCvLanguages(List<Integer> candidateLanguageIds, int candidateCvId) {
        if (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId))
            return new ErrorResult("candidateCvId: does not exist");
        CandidateCv candidateCv = candidateCvDao.getById(candidateCvId);
        List<Integer> currentCandidateLanguageIds = new ArrayList<>();
        candidateCv.getCandidateLanguages().forEach(candidateLanguage -> currentCandidateLanguageIds.add(candidateLanguage.getId()));
        deleteLanguagesFromCandidateCv(currentCandidateLanguageIds, candidateCvId, (byte) 1);
        if (candidateLanguageIds != null && candidateLanguageIds.get(0) != null && candidateLanguageIds.get(0) != -1) {
            Result result = addLanguagesToCandidateCv(candidateLanguageIds, candidateCvId, (byte) 0);
            return new SuccessDataResult<>("Add results:", result);
        }
        return new SuccessResult("Success");
    }

    @Override
    public Result syncCandidateCvSchools(List<Integer> candidateSchoolIds, int candidateCvId) {
        if (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId))
            return new ErrorResult("candidateCvId: does not exist");
        CandidateCv candidateCv = candidateCvDao.getById(candidateCvId);
        List<Integer> currentCandidateSchoolIds = new ArrayList<>();
        candidateCv.getCandidateSchools().forEach(candidateSchool -> currentCandidateSchoolIds.add(candidateSchool.getId()));
        deleteSchoolsFromCandidateCv(currentCandidateSchoolIds, candidateCvId, (byte) 1);
        if (candidateSchoolIds != null && candidateSchoolIds.get(0) != null && candidateSchoolIds.get(0) != -1) {
            Result result = addSchoolsToCandidateCv(candidateSchoolIds, candidateCvId, (byte) 0);
            return new SuccessDataResult<>("Add results:", result);
        }
        return new SuccessResult("Success");
    }

    @Override
    public Result syncCandidateCvSkills(List<Integer> candidateSkillIds, int candidateCvId) {
        if (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId))
            return new ErrorResult("candidateCvId: does not exist");
        CandidateCv candidateCv = candidateCvDao.getById(candidateCvId);
        List<Integer> currentCandidateSkillIds = new ArrayList<>();
        candidateCv.getCandidateSkills().forEach(candidateSkill -> currentCandidateSkillIds.add(candidateSkill.getId()));
        deleteSkillsFromCandidateCv(currentCandidateSkillIds, candidateCvId, (byte) 1);
        if (candidateSkillIds != null && candidateSkillIds.get(0) != null && candidateSkillIds.get(0) != -1) {
            Result result = addSkillsToCandidateCv(candidateSkillIds, candidateCvId, (byte) 0);
            return new SuccessDataResult<>("Add results:", result);
        }
        return new SuccessResult("Success");
    }

    @Override
    public Result addJobExperiencesToCandidateCv(List<Integer> candidateJobExperienceIds, int candidateCvId, byte checkType) {
        if (candidateJobExperienceIds == null || candidateJobExperienceIds.size() == 0)
            return new Result(false, "candidateJobExperienceIds are not found, nothing added");
        if (checkType == 0 && (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId)))
            return new ErrorResult("candidateCvId: does not exist");
        Map<String, String> errors = new HashMap<>();
        CandidateCv candidateCv = candidateCvDao.getById(candidateCvId);
        int success = 0, fail = 0;
        for (int i = 0; i < candidateJobExperienceIds.size(); i++) {
            Integer candidateJobExperienceId = candidateJobExperienceIds.get(i);
            fail++;
            if (candidateJobExperienceId <= 0 || !candidateJobExperienceDao.existsById(candidateJobExperienceId)) {
                errors.put(String.format("candidateJobExperienceIds[%d]", i), "does not exist");
                continue;
            }
            if (checkType == 0 && (candidateCvDao.existsCandidateJobExperienceInCv(candidateJobExperienceId, candidateCvId))) {
                errors.put(String.format("candidateJobExperienceIds[%d]", i), "this CV already contains this job experience");
                continue;
            }
            CandidateJobExperience candidateJobExperience = candidateJobExperienceDao.getById(candidateJobExperienceId);
            if (candidateCv.getCandidate().getId() != candidateJobExperience.getCandidate().getId()) {
                errors.put(String.format("candidateJobExperienceIds[%d] - candidateCvId", i), "the candidate that have this CV does not have this job experience");
                continue;
            }
            candidateCvDao.addJobExperienceToCandidateCv(candidateJobExperienceId, candidateCvId);
            fail--;
            success++;
        }
        return getAdditionResults(success, fail, errors);
    }

    @Override
    public Result addLanguagesToCandidateCv(List<Integer> candidateLanguageIds, int candidateCvId, byte checkType) {
        if (candidateLanguageIds == null || candidateLanguageIds.size() == 0)
            return new Result(false, "candidateLanguageIds are not found");
        if (checkType == 0 && (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId)))
            return new ErrorResult("candidateCvId: does not exist");
        Map<String, String> errors = new HashMap<>();
        CandidateCv candidateCv = candidateCvDao.getById(candidateCvId);
        int success = 0, fail = 0;
        for (int i = 0; i < candidateLanguageIds.size(); i++) {
            Integer candidateLanguageId = candidateLanguageIds.get(i);
            fail++;
            if (candidateLanguageId <= 0 || !candidateLanguageDao.existsById(candidateLanguageId)) {
                errors.put(String.format("candidateLanguageIds[%d]", i), "does not exist");
                continue;
            }
            if (checkType == 0 && (candidateCvDao.existsCandidateLanguageInCv(candidateLanguageId, candidateCvId))) {
                errors.put(String.format("candidateLanguageIds[%d]", i), "this CV already contains this language");
                continue;
            }
            CandidateLanguage candidateLanguage = candidateLanguageDao.getById(candidateLanguageId);
            if (candidateCv.getCandidate().getId() != candidateLanguage.getCandidate().getId()) {
                errors.put(String.format("candidateLanguageIds[%d] - candidateCvId", i), "the candidate that have this CV does not have this language");
                continue;
            }
            candidateCvDao.addLanguageToCandidateCv(candidateLanguageId, candidateCvId);
            fail--;
            success++;
        }
        return getAdditionResults(success, fail, errors);
    }

    @Override
    public Result addSchoolsToCandidateCv(List<Integer> candidateSchoolIds, int candidateCvId, byte checkType) {
        if (candidateSchoolIds == null || candidateSchoolIds.size() == 0)
            return new Result(false, "candidateSchoolIds are not found");
        if (checkType == 0 && (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId)))
            return new ErrorResult("candidateCvId: does not exist");
        Map<String, String> errors = new HashMap<>();
        CandidateCv candidateCv = candidateCvDao.getById(candidateCvId);
        int success = 0, fail = 0;
        for (int i = 0; i < candidateSchoolIds.size(); i++) {
            Integer candidateSchoolId = candidateSchoolIds.get(i);
            fail++;
            if (candidateSchoolId <= 0 || !candidateSchoolDao.existsById(candidateSchoolId)) {
                errors.put(String.format("candidateSchoolIds[%d]", i), "does not exist");
                continue;
            }
            if (checkType == 0 && (candidateCvDao.existsCandidateSchoolInCv(candidateSchoolId, candidateCvId))) {
                errors.put(String.format("candidateSchoolIds[%d]", i), "this CV already contains this school");
                continue;
            }
            CandidateSchool candidateSchool = candidateSchoolDao.getById(candidateSchoolId);
            if (candidateCv.getCandidate().getId() != candidateSchool.getCandidate().getId()) {
                errors.put(String.format("candidateSchoolIds[%d] - candidateCvId", i), "the candidate that have this CV does not have this school");
                continue;
            }
            candidateCvDao.addSchoolToCandidateCv(candidateSchoolId, candidateCvId);
            fail--;
            success++;
        }
        return getAdditionResults(success, fail, errors);
    }

    @Override
    public Result addSkillsToCandidateCv(List<Integer> candidateSkillIds, int candidateCvId, byte checkType) {
        if (candidateSkillIds == null || candidateSkillIds.size() == 0)
            return new Result(false, "candidateSkillIds are not found");
        if (checkType == 0 && (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId)))
            return new ErrorResult("candidateCvId: does not exist");
        Map<String, String> errors = new HashMap<>();
        CandidateCv candidateCv = candidateCvDao.getById(candidateCvId);
        int success = 0, fail = 0;
        for (int i = 0; i < candidateSkillIds.size(); i++) {
            Integer candidateSkillId = candidateSkillIds.get(i);
            fail++;
            if (candidateSkillId <= 0 || !candidateSkillDao.existsById(candidateSkillId)) {
                errors.put(String.format("candidateSkillIds[%d]", i), "does not exist");
                continue;
            }
            if (checkType == 0 && (candidateCvDao.existsCandidateSkillInCv(candidateSkillId, candidateCvId))) {
                errors.put(String.format("candidateSkillIds[%d]", i), "this CV already contains this skill");
                continue;
            }
            CandidateSkill candidateSkill = candidateSkillDao.getById(candidateSkillId);
            if (candidateCv.getCandidate().getId() != candidateSkill.getCandidate().getId()) {
                errors.put(String.format("candidateSkillIds[%d] - candidateCvId", i), "the candidate that have this CV does not have this skill");
                continue;
            }
            candidateCvDao.addSkillToToCandidateCv(candidateSkillId, candidateCvId);
            fail--;
            success++;
        }
        return getAdditionResults(success, fail, errors);
    }

    @Override
    public Result deleteJobExperiencesFromCandidateCv(List<Integer> candidateJobExperienceIds, int candidateCvId, byte checkType) {
        if (checkType == 0 && (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId)))
            return new ErrorResult("candidateCvId: does not exist");
        if (checkType == 0) {
            Map<String, String> results = new HashMap<>();
            for (int i = 0; i < candidateJobExperienceIds.size(); i++) {
                Integer candidateJobExperienceId = candidateJobExperienceIds.get(i);
                if (candidateJobExperienceId <= 0 ||
                        !candidateCvDao.existsCandidateJobExperienceInCv(candidateJobExperienceId, candidateCvId)) {
                    results.put(String.format("candidateJobExperienceIds[%d]", i), "record does not exist");
                    continue;
                }
                candidateCvDao.deleteJobExperienceFromCandidateCv(candidateJobExperienceId, candidateCvId);
            }
            if (results.isEmpty()) results.put("result", "Completely Successful");
            return new SuccessDataResult<>("Success", results);
        }
        candidateJobExperienceIds.forEach((candidateJobExperienceId) -> candidateCvDao.deleteJobExperienceFromCandidateCv(candidateJobExperienceId, candidateCvId));
        return new SuccessResult("Success");
    }

    @Override
    public Result deleteLanguagesFromCandidateCv(List<Integer> candidateLanguageIds, int candidateCvId, byte checkType) {
        if (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId))
            return new ErrorResult("candidateCvId: does not exist");
        if (checkType == 0) {
            Map<String, String> results = new HashMap<>();
            for (int i = 0; i < candidateLanguageIds.size(); i++) {
                Integer candidateLanguageId = candidateLanguageIds.get(i);
                if (candidateLanguageId <= 0 ||
                        !candidateCvDao.existsCandidateLanguageInCv(candidateLanguageId, candidateCvId)) {
                    results.put(String.format("candidateLanguageIds[%d]", i), "record does not exist");
                    continue;
                }
                candidateCvDao.deleteLanguageFromCandidateCv(candidateLanguageId, candidateCvId);
            }
            if (results.isEmpty()) results.put("result", "Completely Successful");
            return new SuccessDataResult<>("Success", results);
        }
        candidateLanguageIds.forEach((candidateLanguageId) -> candidateCvDao.deleteLanguageFromCandidateCv(candidateLanguageId, candidateCvId));
        return new SuccessResult("Success");
    }

    @Override
    public Result deleteSchoolsFromCandidateCv(List<Integer> candidateSchoolIds, int candidateCvId, byte checkType) {
        if (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId))
            return new ErrorResult("candidateCvId: does not exist");
        if (checkType == 0) {
            Map<String, String> results = new HashMap<>();
            for (int i = 0; i < candidateSchoolIds.size(); i++) {
                Integer candidateSchoolId = candidateSchoolIds.get(i);
                if (candidateSchoolId <= 0 ||
                        !candidateCvDao.existsCandidateSchoolInCv(candidateSchoolId, candidateCvId)) {
                    results.put(String.format("candidateSchoolIds[%d]", i), "record does not exist");
                    continue;
                }
                candidateCvDao.deleteSchoolFromCandidateCv(candidateSchoolId, candidateCvId);
            }
            if (results.isEmpty()) results.put("result", "Completely Successful");
            return new SuccessDataResult<>("Success", results);
        }
        candidateSchoolIds.forEach((candidateSchoolId) -> candidateCvDao.deleteSchoolFromCandidateCv(candidateSchoolId, candidateCvId));
        return new SuccessResult("Success");
    }

    @Override
    public Result deleteSkillsFromCandidateCv(List<Integer> candidateSkillIds, int candidateCvId, byte checkType) {
        if (candidateCvId <= 0 || !candidateCvDao.existsById(candidateCvId))
            return new ErrorResult("candidateCvId: does not exist");
        if (checkType == 0){
            Map<String, String> results = new HashMap<>();
            for (int i = 0; i < candidateSkillIds.size(); i++) {
                Integer candidateSkillId = candidateSkillIds.get(i);
                if (candidateSkillId <= 0 ||
                        !candidateCvDao.existsCandidateSkillInCv(candidateSkillId, candidateCvId)) {
                    results.put(String.format("candidateSkillIds[%d]", i), "record does not exist");
                    continue;
                }
                candidateCvDao.deleteSkillFromCandidateCv(candidateSkillId, candidateCvId);
            }
            if (results.isEmpty()) results.put("result", "Completely Successful");
            return new SuccessDataResult<>("Success", results);
        }
        candidateSkillIds.forEach((candidateSkillId) -> candidateCvDao.deleteSkillFromCandidateCv(candidateSkillId, candidateCvId));
        return new SuccessResult("Success");
    }

    public Result getAdditionResults(int success, int fail, Map<String, String> errors) {
        if (fail == 0) {
            return new SuccessResult("Completely Successful");
        } else if (success * 0.6 >= fail) {
            errors.put("result summary", ("success rate: %" + String.format("%.2f", ((double) success / (fail + success) * 100))) + String.format(" (success -> %d  failed -> %d)", success, fail));
            return new SuccessDataResult<>("Mostly Successful", errors);
        } else if (success != 0) {
            errors.put("result summary", ("success rate: %" + String.format("%.2f", ((double) success / (fail + success) * 100))) + String.format(" (success -> %d  failed -> %d)", success, fail));
            return new ErrorDataResult<>("Mostly Failed", errors);
        } else {
            return new ErrorDataResult<>("Completely Failed", errors);
        }
    }
}
