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

    private int candidateId;

    private int schoolId;

    private short departmentId;

    @Min(value = 1900, message = "invalid school start year")
    @Max(value = 2030, message = "invalid school start year")
    private short schoolStartYear;

    @Min(value = 1900, message = "invalid graduation year")
    @Max(value = 2030, message = "invalid graduation year")
    private Short graduationYear;
}
