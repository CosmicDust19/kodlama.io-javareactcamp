package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateJobExperienceAddDto {

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Integer candidateId;

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Size(max = Utils.Const.MAX_JOB_EXP_WORKPLACE)
    private String workPlace;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Short positionId;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    @Min(value = Utils.Const.MIN_YEAR)
    @Max(value = Utils.Const.THIS_YEAR)
    private Short startYear;

    @Min(value = Utils.Const.MIN_YEAR)
    @Max(value = Utils.Const.THIS_YEAR)
    private Short quitYear;

}
