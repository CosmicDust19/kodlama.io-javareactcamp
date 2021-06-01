package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SystemEmployeesAddDto extends UserAddDto{

    @NotBlank(message = "This field can't be empty.")
    @Size(min = 2, max = 50, message = "Please enter your real first name.")
    private String firstName;

    @NotBlank(message = "This field can't be empty.")
    @Size(min = 2, max = 50, message = "Please enter your real last name.")
    private String lastName;
}
