package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.CandidateCv;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateCvAddDto;

import java.util.List;

public interface CandidateCvService {
    DataResult<List<CandidateCv>> getAll();

    DataResult<CandidateCv> getById(int id);

    Result add(CandidateCvAddDto candidateCvAddDto);

    DataResult<Boolean> deleteById(int id);

    Result updateTitle(String title, int id);

    Result updateCoverLetter(String coverLetter, int id);

    Result syncCandidateCvJobExperiences(List<Integer> candidateJobExperienceIds, int candidateCvId);

    Result syncCandidateCvLanguages(List<Integer> candidateLanguageIds, int candidateCvId);

    Result syncCandidateCvSchools(List<Integer> candidateSchoolIds, int candidateCvId);

    Result syncCandidateCvSkills(List<Integer> candidateSkillIds, int candidateCvId);

    Result addJobExperiencesToCandidateCv(List<Integer> candidateJobExperienceIds, int candidateCvId, byte checkType);

    Result addLanguagesToCandidateCv(List<Integer> candidateLanguageIds, int candidateCvId, byte checkType);

    Result addSchoolsToCandidateCv(List<Integer> candidateSchoolIds, int candidateCvId, byte checkType);

    Result addSkillsToCandidateCv(List<Integer> candidateSchoolIds, int candidateCvId, byte checkType);

    Result deleteJobExperiencesFromCandidateCv(List<Integer> candidateJobExperienceIds, int candidateCvId, byte checkType);

    Result deleteLanguagesFromCandidateCv(List<Integer> candidateLanguageIds, int candidateCvId, byte checkType);

    Result deleteSchoolsFromCandidateCv(List<Integer> candidateSchoolIds, int candidateCvId, byte checkType);

    Result deleteSkillsFromCandidateCv(List<Integer> candidateSkillIds, int candidateCvId, byte checkType);
}
