package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateJobExperienceAddDto {

    private int candidateId;

    @NotBlank(message = "cannot be empty")
    @Size(min = 2, max = 100, message = "invalid workplace")
    private String workPlace;

    private short positionId;

    @Min(value = 1900, message = "invalid start year")
    @Max(value = 2030, message = "invalid start year")
    private short startYear;

    @Min(value = 1900, message = "invalid quit year")
    @Max(value = 2030, message = "invalid quit year")
    private Short quitYear;
}
