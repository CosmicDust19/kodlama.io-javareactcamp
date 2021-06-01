package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PositionAddDto {

    @NotBlank(message = "This field can't be empty.")
    private String title;

    @Size(max = 200, message = "Position detail cannot be longer than 200 character text")
    private String detail;
}
