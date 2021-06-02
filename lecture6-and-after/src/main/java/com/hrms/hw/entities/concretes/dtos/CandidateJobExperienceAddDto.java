package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateJobExperienceAddDto {

    @Positive(message = "Please enter a positive integer (CV id).")
    private int candidateId;

    @NotBlank(message = "This field can't be empty.")
    @Size(min = 2, max = 100, message = "Please enter your real workplace.")
    private String workPlace;

    @Positive(message = "Please enter a positive integer (Position id).")
    private short positionId;

    @Min(value = 1900, message = "Please enter your birth year properly")
    @Max(value = 2030, message = "Please enter your birth year properly")
    private short startYear;

    @Min(value = 1900, message = "Please enter your birth year properly")
    @Max(value = 2030, message = "Please enter your birth year properly")
    private Short quitYear;
}
