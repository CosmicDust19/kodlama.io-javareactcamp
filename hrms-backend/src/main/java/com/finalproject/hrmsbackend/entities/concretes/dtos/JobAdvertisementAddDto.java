package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.entities.concretes.City;
import com.finalproject.hrmsbackend.entities.concretes.Position;
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

    private Position position;

    @NotBlank(message = "cannot be empty")
    private String jobDescription;

    private City city;

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

    private String workModel;

    private String workTime;

}
