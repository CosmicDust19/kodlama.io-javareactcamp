package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.entities.concretes.Department;
import com.finalproject.hrmsbackend.entities.concretes.School;
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

    private Integer id;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Integer candidateId;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private School school;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Department department;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    @Min(value = Utils.Const.MIN_YEAR)
    @Max(value = Utils.Const.THIS_YEAR)
    private Short startYear;

    @Min(value = Utils.Const.MIN_YEAR)
    @Max(value = Utils.Const.THIS_YEAR)
    private Short graduationYear;

}
