package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "candidates_schools",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"candidate_id", "school_id", "department_id"})})
public class CandidateSchool {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidates_schools_id_generator")
    @SequenceGenerator(name = "candidates_schools_id_generator", sequenceName = "candidates_schools_id_seq", allocationSize = 1)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "school_start_year", nullable = false)
    private short schoolStartYear;

    @Column(name = "graduation_year")
    private Short graduationYear;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "candidateSchools")
    private List<CandidateCv> candidateCvs;
}
