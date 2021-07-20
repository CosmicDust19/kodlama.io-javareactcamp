package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CvService;
import com.finalproject.hrmsbackend.core.business.CheckService;
import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.*;
import com.finalproject.hrmsbackend.entities.abstracts.CvProp;
import com.finalproject.hrmsbackend.entities.concretes.*;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CvAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CvManager implements CvService {

    private final CandidateDao candidateDao;
    private final CvDao cvDao;
    private final CandidateJobExperienceDao candidateJobExpDao;
    private final CandidateLanguageDao candidateLangDao;
    private final CandidateSchoolDao candidateSchoolDao;
    private final CandidateSkillDao candidateSkillDao;
    private final ModelMapper modelMapper;
    private final CheckService check;

    @Override
    public boolean existsCandidatePropInCv(Class<?> propType, int propId, int cvId) {
        if (propId <= 0) return false;
        else if (CandidateJobExperience.class.equals(propType) && cvDao.existsCandidateJobExpInCv(propId, cvId)) return true;
        else if (CandidateLanguage.class.equals(propType) && cvDao.existsCandidateLangInCv(propId, cvId)) return true;
        else if (CandidateSchool.class.equals(propType) && cvDao.existsCandidateSchoolInCv(propId, cvId)) return true;
        else return CandidateSkill.class.equals(propType) && cvDao.existsCandidateSkillInCv(propId, cvId);
    }

    @Override
    public DataResult<List<Cv>> getAll() {
        return new SuccessDataResult<>(cvDao.findAll());
    }

    @Override
    public DataResult<Cv> getById(int id) {
        return new SuccessDataResult<>(cvDao.getById(id));
    }

    @Override
    public Result add(CvAddDto cvAddDto) {

        if (check.notExistsById(candidateDao, cvAddDto.getCandidateId()))
            return new ErrorResult(MSGs.NOT_EXIST.get("candidateId"));

        Cv cv = modelMapper.map(cvAddDto, Cv.class);

        cv.setTitle(cv.getTitle().trim());
        if (cvDao.existsByTitleAndCandidate(cv.getTitle(), cv.getCandidate()))
            return new ErrorResult(MSGs.USED.get("title"));

        //gather property ids that will be saved
        List<Integer> candidateJobExperienceIds = gatherIds(cv.getCandidateJobExperiences());
        List<Integer> candidateLanguageIds = gatherIds(cv.getCandidateLanguages());
        List<Integer> candidateSchoolIds = gatherIds(cv.getCandidateSchools());
        List<Integer> candidateSkillIds = gatherIds(cv.getCandidateSkills());

        //save raw cv after gather property ids
        cv.setCandidateJobExperiences(new ArrayList<>());
        cv.setCandidateLanguages(new ArrayList<>());
        cv.setCandidateSchools(new ArrayList<>());
        cv.setCandidateSkills(new ArrayList<>());
        Cv savedCv = cvDao.save(cv);

        //save properties and return results
        Map<String, Result> results = new LinkedHashMap<>();
        results.put("candidateJobExperiences", addPropsToCv(savedCv.getId(), candidateJobExperienceIds, candidateJobExpDao, Utils.CheckType.PARTLY, CandidateJobExperience.class));
        results.put("candidateLanguages", addPropsToCv(savedCv.getId(), candidateLanguageIds, candidateLangDao, Utils.CheckType.PARTLY, CandidateLanguage.class));
        results.put("candidateSchools", addPropsToCv(savedCv.getId(), candidateSchoolIds, candidateSchoolDao, Utils.CheckType.PARTLY, CandidateSchool.class));
        results.put("candidateSkills", addPropsToCv(savedCv.getId(), candidateSkillIds, candidateSkillDao, Utils.CheckType.PARTLY, CandidateSkill.class));
        return new SuccessDataResult<>(Integer.toString(savedCv.getId()), results);
    }

    @Override
    public Result deleteById(int id) {
        cvDao.deleteById(id);
        return new SuccessResult(MSGs.DELETED.get());
    }

    @Override
    public Result updateTitle(String title, int id) {
        if (check.notExistsById(cvDao, id))
            return new ErrorResult(MSGs.NOT_EXIST.get("id"));
        if (cvDao.existsByTitleAndCandidate(title, cvDao.getById(id).getCandidate()))
            return new ErrorResult(MSGs.USED.get("title"));

        cvDao.updateTitle(title, id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateCoverLetter(String coverLetter, int id) {
        if (check.notExistsById(cvDao, id)) return new ErrorResult(MSGs.NOT_EXIST.get("id"));
        cvDao.updateCoverLetter(coverLetter, id);
        cvDao.updateLastModifiedAt(LocalDateTime.now(), id);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result addPropsToCv(int cvId, List<Integer> cvPropIds, JpaRepository<?, Integer> cvPropDao, String checkType, Class<?> propType) {
        if (cvPropIds == null || cvPropIds.size() == 0)
            return new ErrorResult(MSGs.NO_ID_FOUND.get());
        if (checkType.equals(Utils.CheckType.ALL) && check.notExistsById(cvDao, cvId))
            return new ErrorResult(MSGs.NOT_EXIST.get("cvId"));

        Cv cv = cvDao.getById(cvId);
        Map<String, String> errors = new LinkedHashMap<>();
        for (int i = 0; i < cvPropIds.size(); i++) {
            Integer propId = cvPropIds.get(i);
            //exists prop
            if (check.notExistsById(cvPropDao, propId)) {
                errors.put(String.format("%sIds[%d](id: %d)", propType.getSimpleName(), i, propId), MSGs.NOT_EXIST.get());
                continue;
            }
            //exists prop in cv
            if (checkType.equals(Utils.CheckType.ALL) && existsCandidatePropInCv(propType, propId, cvId)) {
                errors.put(String.format("%sIds[%d](id: %d)", propType.getSimpleName(), i, propId), MSGs.ALREADY_CONTAINS.get("CV"));
                continue;
            }
            //candidate have this prop
            CvProp cvProp = (CvProp) cvPropDao.getById(propId);
            if (!cv.getCandidate().getId().equals(cvProp.getCandidate().getId())) {
                errors.put(String.format("%sIds[%d] - cvId", propType.getSimpleName(), i), MSGs.NOT_HAVE.get("candidate"));
                continue;
            }
            addPropToCv(propType, propId, cvId);
        }
        // get results
        int success = cvPropIds.size() - errors.size(), fail = cvPropIds.size() - success;
        if (success > 0) cvDao.updateLastModifiedAt(LocalDateTime.now(), cvId);
        return getPropUpdateResults(success, fail, errors);
    }

    @Override
    public Result deletePropsFromCv(int cvId, List<Integer> cvPropIds, String checkType, Class<?> propType) {
        if (cvPropIds == null || cvPropIds.size() == 0)
            return new ErrorResult(MSGs.NO_ID_FOUND.get());

        // check ?
        if (checkType.equals(Utils.CheckType.ALL)) {
            if (check.notExistsById(cvDao, cvId))
                return new ErrorResult(MSGs.NOT_EXIST.get("cvId"));

            Map<String, String> errors = new LinkedHashMap<>();
            for (int i = 0; i < cvPropIds.size(); i++) {
                Integer propId = cvPropIds.get(i);
                // exists prop in CV
                if (!existsCandidatePropInCv(propType, propId, cvId)) {
                    errors.put(String.format("%sIds[%d](id: %d)", propType.getSimpleName(), i, propId), MSGs.NOT_EXIST.getCustom("%s in CV"));
                    continue;
                }
                deletePropFromCv(propType, propId, cvId);
            }

            //get checked deletion results
            int success = cvPropIds.size() - errors.size(), fail = cvPropIds.size() - success;
            if (success > 0) cvDao.updateLastModifiedAt(LocalDateTime.now(), cvId);
            return getPropUpdateResults(success, fail, errors);
        }

        //simple delete
        cvPropIds.forEach((propId) -> deletePropFromCv(propType, propId, cvId));
        cvDao.updateLastModifiedAt(LocalDateTime.now(), cvId);
        return new SuccessResult(MSGs.DELETED.get());
    }

    private void addPropToCv(Class<?> propType, int propId, int cvId) {
        if (CandidateJobExperience.class.equals(propType)) cvDao.addJobExpToCv(propId, cvId);
        else if (CandidateLanguage.class.equals(propType)) cvDao.addLangToCv(propId, cvId);
        else if (CandidateSchool.class.equals(propType)) cvDao.addSchoolToCv(propId, cvId);
        else if (CandidateSkill.class.equals(propType)) cvDao.addSkillToCv(propId, cvId);
    }

    private void deletePropFromCv(Class<?> propType, int propId, int cvId) {
        if (CandidateJobExperience.class.equals(propType)) cvDao.deleteJobExpFromCv(propId, cvId);
        else if (CandidateLanguage.class.equals(propType)) cvDao.deleteLangFromCv(propId, cvId);
        else if (CandidateSchool.class.equals(propType)) cvDao.deleteSchoolFromCv(propId, cvId);
        else if (CandidateSkill.class.equals(propType)) cvDao.deleteSkillFromCv(propId, cvId);
    }

    private Result getPropUpdateResults(int success, int fail, Map<String, String> results) {
        if (fail == 0) return new SuccessResult(MSGs.SUCCESS.get("Completely"));
        else if (success == 0) return new ErrorDataResult<>(MSGs.FAILED.get("Completely"), results);

        String resultSum = ("Success Rate: %" + String.format("%.2f", ((double) success / (fail + success) * 100))) + String.format(" (Successful -> %d  Failed -> %d)", success, fail);
        if (success * 0.7 >= fail) {
            results.put(MSGs.RESULT_SUM.get(), resultSum);
            return new SuccessDataResult<>(MSGs.SUCCESS.get("Mostly"), results);
        } else {
            results.put(MSGs.RESULT_SUM.get(), resultSum);
            return new ErrorDataResult<>(MSGs.FAILED.get("Mostly"), results);
        }
    }

    private <T extends BaseEntity<Integer>> List<Integer> gatherIds(List<T> candidateProps) {
        List<Integer> Ids = new ArrayList<>();
        if (candidateProps == null) return Ids;
        for (T candidateProp : candidateProps) {
            if (candidateProp == null) continue;
            Ids.add(candidateProp.getId());
        }
        return Ids;
    }

}
