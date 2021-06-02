package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "candidates_languages")
public class CandidateLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidates_languages_id_generator")
    @SequenceGenerator(name = "candidates_languages_id_generator", sequenceName = "candidates_languages_id_seq", allocationSize = 1)
    @JsonIgnore
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "language_id", nullable = false)
    private Language language;

    @Column(name = "language_level", nullable = false)
    private String languageLevel;

    //temporary
    public void setCandidateIdLanguageId(int candidateId, short languageId) {
        this.candidate.setId(candidateId);
        this.language.setId(languageId);
    }
}
