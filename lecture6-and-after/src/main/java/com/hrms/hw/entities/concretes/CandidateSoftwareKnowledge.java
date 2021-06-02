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
@Table(name = "candidates_software_knowledge")
public class CandidateSoftwareKnowledge {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidates_software_knowledge_generator")
    @SequenceGenerator(name = "candidates_software_knowledge_generator", sequenceName = "candidates_software_knowledge_seq", allocationSize = 1)
    @JsonIgnore
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "candidates_id")
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "software_knowledge_id")
    private SoftwareKnowledge softwareKnowledge;

    //temporary
    public CandidateSoftwareKnowledge(int candidateId, short softwareKnowledgeId) {
        this.candidate.setId(candidateId);
        this.softwareKnowledge.setId(softwareKnowledgeId);
    }
}
