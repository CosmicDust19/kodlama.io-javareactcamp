package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateAddDto extends UserAddDto{

    @NotBlank(message = "This field can't be empty.")
    @Size(min = 2, max = 50, message = "Please enter your real first name.")
    private String firstName;

    @NotBlank(message = "This field can't be empty.")
    @Size(min = 2, max = 50, message = "Please enter your real last name.")
    private String lastName;

    @NotBlank(message = "This field can't be empty.")
    @Pattern(regexp = "\\d{11}", message = "Please enter your nationality id properly")
    private String nationalityId;

    @Min(value = 1900, message = "Please enter your birth year properly")
    @Max(value = 2030, message = "Please enter your birth year properly")
    private short birthYear;

}
