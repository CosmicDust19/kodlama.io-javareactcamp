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
@Table(name = "candidates_languages",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"candidate_id", "language_id"})})
public class CandidateLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidates_languages_id_generator")
    @SequenceGenerator(name = "candidates_languages_id_generator", sequenceName = "candidates_languages_id_seq", allocationSize = 1)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnoreProperties(value = {"candidateCvs","candidateImages", "candidateJobExperiences",
            "candidateLanguages", "candidateSchools", "candidateSkills"})
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "language_id", nullable = false, unique = true)
    private Language language;

    @Column(name = "language_level", nullable = false)
    private String languageLevel;

}
