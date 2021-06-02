package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Positive;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateCvAddDto {

    @Positive(message = "Please enter a positive integer (Candidate id).")
    private int candidateId;

    private String coverLetter;

    private List<CandidateJobExperienceAddDto> candidateJobExperiences;

    private List<CandidateLanguageAddDto> candidateLanguages;

    private List<CandidateSchoolAddDto> candidateSchools;

    private List<CandidateSoftwareKnowledgeAddDto> candidateSoftwareKnowledgeList;

}
