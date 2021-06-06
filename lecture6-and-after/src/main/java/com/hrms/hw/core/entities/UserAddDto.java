package com.hrms.hw.core.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAddDto {

    @NotBlank(message = "This field can't be empty.")
    @Pattern(regexp = "^\\w+(\\.\\w+)*@[a-zA-Z]+(\\.\\w{2,6})+$", message = "Please enter your e-mail properly. ")
    private String email;

    @NotBlank(message = "This field can't be empty.")
    @Size(min = 6, max = 20, message = "Please enter a password between 6 and 20 long")
    private String password;

    @NotBlank(message = "This field can't be empty.")
    private String passwordRepeat;
}
