package com.hrms.hw.entities.concretes.dtos;

import lombok.*;

import javax.validation.constraints.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobAdvertisementAddDto {

    @Positive(message = "Please enter a positive integer (Employer id).")
    private int employer;

    @Positive(message = "Please enter a positive integer (Position id).")
    private short position;

    @NotBlank(message = "This field can't be empty.")
    private String jobDescription;

    @Positive(message = "Please enter a positive integer (City id).")
    private short city;

    //If i do not declare this variable in a nullable type,
    //when i execute getAll method, it can throw an error
    //because this field may be null in the database.
    @PositiveOrZero(message = "This field should be positive and is not required (zero will be ignored)")
    private Integer minSalary;

    //The same can be said for this field.
    @PositiveOrZero(message = "This field should be positive and is not required (zero will be ignored)")
    private Integer maxSalary;

    @Positive(message = "The number of people to be recruited must be positive.")
    private short numberOfPeopleToBeHired;

    @Future(message = "This field must be a date in the future.")
    private LocalDate applicationDeadline;

}
