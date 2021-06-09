package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateCvAddDto {

    private int candidateId;

    private String title;

    private String coverLetter;

    @Valid
    private List<CandidateJobExperienceAddDto> candidateJobExperiences;

    @Valid
    private List<CandidateLanguageAddDto> candidateLanguages;

    @Valid
    private List<CandidateSchoolAddDto> candidateSchools;

    @Valid
    private List<CandidateSkillAddDto> candidateSkills;

}
