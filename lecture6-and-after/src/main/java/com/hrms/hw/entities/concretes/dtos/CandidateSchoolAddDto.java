package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Positive;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateSchoolAddDto {

    @Positive
    private int candidateId;

    @Positive
    private int schoolId;

    @Positive
    private short departmentId;

    @Min(value = 1900)
    @Max(value = 2030)
    private short schoolStartYear;

    @Min(value = 1900)
    @Max(value = 2030)
    private short graduationYear;
}
