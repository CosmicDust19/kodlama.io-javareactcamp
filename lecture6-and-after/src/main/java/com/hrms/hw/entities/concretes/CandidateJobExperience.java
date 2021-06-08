package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "candidates_job_experiences",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"candidate_id", "workplace", "position_id"})})
public class CandidateJobExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidates_job_experiences_id_generator")
    @SequenceGenerator(name = "candidates_job_experiences_id_generator", sequenceName = "candidates_job_experiences_id_seq", allocationSize = 1)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnoreProperties(value = {"candidateCvs", "candidateImages", "candidateJobExperiences",
            "candidateLanguages", "candidateSchools", "candidateSkills"})
    private Candidate candidate;

    @Column(name = "workplace", nullable = false)
    private String workPlace;

    @ManyToOne
    @JoinColumn(name = "position_id", nullable = false)
    @JsonIgnoreProperties(value = {"jobAdvertisements"})
    private Position position;

    @Column(name = "start_year", nullable = false)
    private short startYear;

    @Column(name = "quit_year")
    private Short quitYear;

}
