package com.finalproject.hrmsbackend.core.entities;

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

    @NotBlank(message = "cannot be empty")
    @Pattern(regexp = "^\\w+(\\.\\w+)*@[a-zA-Z]+(\\.\\w{2,6})+$", message = "invalid e-mail")
    private String email;

    @NotBlank(message = "cannot be empty")
    @Size(min = 6, max = 20, message = "should be a text between 6 and 20 long")
    private String password;

}
