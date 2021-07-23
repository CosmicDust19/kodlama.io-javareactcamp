package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateLanguageAddDto {

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Integer candidateId;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Short languageId;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    @Pattern(regexp = Utils.Const.LANG_LVL_REGEXP, message = MSGs.ForAnnotation.INVALID_LANG_LVL)
    private String languageLevel;

}
