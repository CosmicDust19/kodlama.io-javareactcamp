package com.hrms.hw.entities.concretes.dtos;

import com.hrms.hw.entities.concretes.Department;
import com.hrms.hw.entities.concretes.School;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateSchoolAddDto {

    private int candidateId;

    @Valid
    private School school;

    @Valid
    private Department department;

    @Min(value = 1900, message = "invalid school start year")
    @Max(value = 2030, message = "invalid school start year")
    private short schoolStartYear;

    @Min(value = 1900, message = "invalid graduation year")
    @Max(value = 2030, message = "invalid graduation year")
    private Short graduationYear;
}
