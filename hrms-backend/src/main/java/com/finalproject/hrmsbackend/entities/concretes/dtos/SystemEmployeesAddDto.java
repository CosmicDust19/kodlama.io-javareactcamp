package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.entities.UserAddDto;
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
public class SystemEmployeesAddDto extends UserAddDto {

    @NotBlank(message = "cannot be empty")
    @Size(min = 2, max = 50, message = "invalid first name")
    private String firstName;

    @NotBlank(message = "cannot be empty")
    @Size(min = 2, max = 50, message = "invalid last name")
    private String lastName;
}
