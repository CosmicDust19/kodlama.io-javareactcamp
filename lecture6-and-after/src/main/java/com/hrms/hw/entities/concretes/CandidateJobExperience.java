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
@Table(name = "candidates_job_experiences")
public class CandidateJobExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidates_job_experiences_id_generator")
    @SequenceGenerator(name = "candidates_job_experiences_id_generator", sequenceName = "candidates_job_experiences_id_seq", allocationSize = 1)
    @JsonIgnore
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Column(name = "workplace", nullable = false)
    private String workPlace;

    @ManyToOne
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;

    @Column(name = "start_year", nullable = false)
    private short startYear;

    @Column(name = "quit_year")
    private Short quitYear;

    //temporary
    public void setCandidateIdPositionId(int candidateId, short positionId) {
        this.candidate.setId(candidateId);
        this.position.setId(positionId);
    }
}
