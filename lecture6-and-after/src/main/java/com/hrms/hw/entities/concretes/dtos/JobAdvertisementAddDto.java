package com.hrms.hw.entities.concretes.dtos;

import lombok.*;

import javax.validation.constraints.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobAdvertisementAddDto {

    private int employerId;

    private short positionId;

    @NotBlank(message = "cannot be empty")
    private String jobDescription;

    private short cityId;

    //If i do not declare this variable in a nullable type,
    //when i execute getAll method, it can throw an error
    //because this field may be null in the database.
    @PositiveOrZero(message = "not a positive integer")
    private Integer minSalary;

    //The same can be said for this field.
    @PositiveOrZero(message = "not a positive integer")
    private Integer maxSalary;

    @Positive(message = "not a positive integer")
    private short numberOfPeopleToBeHired;

    @Future(message = "not a date in the future")
    private LocalDate applicationDeadline;

}
