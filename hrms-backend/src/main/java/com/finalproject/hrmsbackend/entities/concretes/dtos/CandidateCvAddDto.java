package com.finalproject.hrmsbackend.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateCvAddDto {

    private Integer id;

    @NotNull(message = "cannot be empty")
    private Integer candidateId;

    @NotBlank(message = "cannot be empty")
    private String title;

    private String coverLetter;

    private List<CandidateJobExperienceAddDto> candidateJobExperiences;

    private List<CandidateLanguageAddDto> candidateLanguages;

    private List<CandidateSchoolAddDto> candidateSchools;

    private List<CandidateSkillAddDto> candidateSkills;

}
