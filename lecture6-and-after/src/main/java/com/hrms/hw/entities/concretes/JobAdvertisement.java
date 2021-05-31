package com.hrms.hw.entities.concretes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "job_advertisements")
public class JobAdvertisement {

    @Id
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "employer_id")
    private Employer employer;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;

    @Column(name = "job_description")
    private String jobDescription;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @Column(name = "min_salary")
    private double minSalary;

    @Column(name = "max_salary")
    private double maxSalary;

    @Column(name = "number_of_people_to_be_hired")
    private short numberOfPeopleToBeHired;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Column(name = "is_active")
    private boolean activationStatus;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "last_modified_at")
    private LocalDate lastModifiedAt;

}
