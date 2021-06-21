package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.entities.UserAddDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateAddDto extends UserAddDto {

    @NotBlank(message = "cannot be empty")
    @Size(min = 2, max = 50, message = "invalid first name")
    private String firstName;

    @NotBlank(message = "cannot be empty")
    @Size(min = 2, max = 50, message = "invalid last name")
    private String lastName;

    @NotBlank(message = "cannot be empty")
    @Pattern(regexp = "\\d{11}", message = "invalid nationality id")
    private String nationalityId;

    @Min(value = 1900, message = "invalid birth year")
    @Max(value = 2030, message = "invalid birth year")
    private short birthYear;

}
