package com.hrms.hw.entities.concretes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "candidates")
@PrimaryKeyJoinColumn(name = "candidate_id", referencedColumnName = "id")
public class Candidate extends User {

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "nationality_id")
    @Size(min = 11, max = 11)
    private String nationalityId;

    @Column(name = "birth_year")
    private short birthYear;

}
