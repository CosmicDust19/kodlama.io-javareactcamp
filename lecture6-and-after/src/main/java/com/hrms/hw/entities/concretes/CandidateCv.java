package com.hrms.hw.entities.concretes;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "candidates_cvs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "jobAdvertisements"})
public class CandidateCv {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidates_cvs_id_generator")
    @SequenceGenerator(name = "candidates_cvs_id_generator", sequenceName = "candidates_cvs_id_seq", allocationSize = 1)
    @JsonIgnore
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Column(name = "cover_letter")
    private String coverLetter;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    @LastModifiedDate
    @Column(name = "last_modified_at")
    private LocalDate lastModifiedAt;

    @ManyToMany
    @JoinTable(name = "candidates_cvs_job_experiences",
            joinColumns = {@JoinColumn(name = "cv_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "candidate_job_exp_id", referencedColumnName = "id")})
    private List<CandidateJobExperience> candidateJobExperiences;

    @ManyToMany
    @JoinTable(name = "candidates_cvs_languages",
            joinColumns = {@JoinColumn(name = "cv_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "candidate_language_id", referencedColumnName = "id")})
    private List<CandidateLanguage> candidateLanguages;

    @ManyToMany
    @JoinTable(name = "candidates_cvs_schools",
            joinColumns = {@JoinColumn(name = "cv_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "candidate_school_id", referencedColumnName = "id")})
    private List<CandidateSchool> candidateSchools;

    @ManyToMany
    @JoinTable(name = "candidates_cvs_software_knowledge",
            joinColumns = {@JoinColumn(name = "cv_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "candidates_sk_id", referencedColumnName = "id")})
    private List<CandidateSoftwareKnowledge> candidateSoftwareKnowledgeList;

    public void setCandidateId(int candidateId){
        this.candidate.setId(candidateId);
    }
}
