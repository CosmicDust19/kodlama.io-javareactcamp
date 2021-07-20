package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CvAddDto {

    private Integer id;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Integer candidateId;

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Size(max = Utils.Const.MAX_CV_TITLE)
    private String title;

    @Size(max = Utils.Const.MAX_CV_COVER_LETTER)
    private String coverLetter;

    private List<@NotNull CandidateJobExperienceAddDto> candidateJobExperiences;

    private List<@NotNull CandidateLanguageAddDto> candidateLanguages;

    private List<@NotNull CandidateSchoolAddDto> candidateSchools;

    private List<@NotNull CandidateSkillAddDto> candidateSkills;

}
