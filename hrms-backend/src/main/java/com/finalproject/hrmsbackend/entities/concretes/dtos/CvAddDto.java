package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CvAddDto {

    @NotNull(message = Msg.Annotation.REQUIRED)
    private Integer candidateId;

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Size(max = Utils.Const.MAX_CV_TITLE, message = Msg.Annotation.SIZE)
    private String title;

    @Size(max = Utils.Const.MAX_CV_COVER_LETTER, message = Msg.Annotation.SIZE)
    private String coverLetter;

    private Set<@NotNull Integer> candidateJobExperienceIds;

    private Set<@NotNull Integer> candidateLanguageIds;

    private Set<@NotNull Integer> candidateSchoolIds;

    private Set<@NotNull Integer> candidateSkillIds;

}
