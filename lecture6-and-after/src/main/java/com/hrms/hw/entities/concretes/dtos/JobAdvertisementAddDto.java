package com.hrms.hw.entities.concretes.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobAdvertisementAddDto {

    private int employerId;

    private int positionId;

    @NotBlank
    private String jobDescription;

    private int cityId;

    @PositiveOrZero
    private double minSalary;

    @PositiveOrZero
    private double maxSalary;

    @Positive
    private short numberOfPeopleToBeHired;

    @NotEmpty
    @Future
    private LocalDate applicationDeadline;
}
