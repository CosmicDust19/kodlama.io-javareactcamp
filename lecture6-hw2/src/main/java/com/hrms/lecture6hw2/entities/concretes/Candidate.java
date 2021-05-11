package com.hrms.lecture6hw2.entities.concretes;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue
    @Column(name = "employee_id")
    private int employee_id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "nationality_id")
    private int nationalityId;

    @Column(name = "job_id")
    private int jobId;

    @Column(name = "birth_year")
    private int birthYear;

    public Candidate(int employee_id, String firstName, String lastName, int nationalityId, int jobId, int birthYear) {
        this.employee_id = employee_id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nationalityId = nationalityId;
        this.jobId = jobId;
        this.birthYear = birthYear;
    }

    public Candidate() {

    }
}
