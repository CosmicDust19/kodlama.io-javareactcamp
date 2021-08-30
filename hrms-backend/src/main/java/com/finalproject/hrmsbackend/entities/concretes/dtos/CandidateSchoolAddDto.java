package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateSchoolAddDto {

    @NotNull(message = Msg.Annotation.REQUIRED)
    private Integer candidateId;

    @NotNull(message = Msg.Annotation.REQUIRED)
    private Integer schoolId;

    @NotNull(message = Msg.Annotation.REQUIRED)
    private Short departmentId;

    @NotNull(message = Msg.Annotation.REQUIRED)
    @Min(value = Utils.Const.MIN_YEAR, message = Msg.Annotation.MIN)
    @Max(value = Utils.Const.THIS_YEAR, message = Msg.Annotation.MAX)
    private Short startYear;

    @Min(value = Utils.Const.MIN_YEAR, message = Msg.Annotation.MIN)
    @Max(value = Utils.Const.THIS_YEAR, message = Msg.Annotation.MAX)
    private Short graduationYear;

}
