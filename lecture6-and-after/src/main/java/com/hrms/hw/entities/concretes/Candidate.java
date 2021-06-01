package com.hrms.hw.entities.concretes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "candidates")
@PrimaryKeyJoinColumn(name = "candidate_id", referencedColumnName = "id")
public class Candidate extends User {

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "nationality_id", nullable = false, unique = true)
    private String nationalityId;

    @Column(name = "birth_year", nullable = false)
    private short birthYear;

}
