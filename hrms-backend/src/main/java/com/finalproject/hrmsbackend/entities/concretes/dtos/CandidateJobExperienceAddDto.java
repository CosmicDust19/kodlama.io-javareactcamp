package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateJobExperienceAddDto {

    @NotNull(message = Msg.Annotation.REQUIRED)
    private Integer candidateId;

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Size(max = Utils.Const.MAX_WORKPLACE, message = Msg.Annotation.SIZE)
    private String workPlace;

    @NotNull(message = Msg.Annotation.REQUIRED)
    private Short positionId;

    @NotNull(message = Msg.Annotation.REQUIRED)
    @Min(value = Utils.Const.MIN_YEAR, message = Msg.Annotation.MIN)
    @Max(value = Utils.Const.THIS_YEAR, message = Msg.Annotation.MAX)
    private Short startYear;

    @Min(value = Utils.Const.MIN_YEAR, message = Msg.Annotation.MIN)
    @Max(value = Utils.Const.THIS_YEAR, message = Msg.Annotation.MAX)
    private Short quitYear;

}
