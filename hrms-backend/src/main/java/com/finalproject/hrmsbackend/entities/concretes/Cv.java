package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "cvs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Cv implements BaseEntity<Integer> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cvs_id_generator")
    @SequenceGenerator(name = "cvs_id_generator", sequenceName = "cvs_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnoreProperties(value = {"candidateCvs", "candidateImages", "candidateJobExperiences",
            "candidateLanguages", "candidateSchools", "candidateSkills"})
    private Candidate candidate;

    @Column(name = "title", nullable = false, unique = true, length = Utils.Const.MAX_CV_TITLE)
    private String title;

    @Column(name = "cover_letter", length = Utils.Const.MAX_CV_COVER_LETTER)
    private String coverLetter;

    @OneToOne
    @JoinColumn(name = "img_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = {"user"})
    private Image image;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt;

    @ManyToMany
    @JoinTable(name = "cvs_job_experiences",
            joinColumns = {@JoinColumn(name = "cv_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "candidate_job_exp_id", referencedColumnName = "id")})
    @JsonIgnoreProperties(value = {"candidate"})
    @ToString.Exclude
    private List<CandidateJobExperience> candidateJobExperiences;

    @ManyToMany
    @JoinTable(name = "cvs_languages",
            joinColumns = {@JoinColumn(name = "cv_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "candidate_language_id", referencedColumnName = "id")})
    @JsonIgnoreProperties(value = {"candidate"})
    @ToString.Exclude
    private List<CandidateLanguage> candidateLanguages;

    @ManyToMany
    @JoinTable(name = "cvs_schools",
            joinColumns = {@JoinColumn(name = "cv_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "candidate_school_id", referencedColumnName = "id")})
    @JsonIgnoreProperties(value = {"candidate"})
    @ToString.Exclude
    private List<CandidateSchool> candidateSchools;

    @ManyToMany
    @JoinTable(name = "cvs_skills",
            joinColumns = {@JoinColumn(name = "cv_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "candidate_skill_id", referencedColumnName = "id")})
    @JsonIgnoreProperties(value = {"candidate"})
    @ToString.Exclude
    private List<CandidateSkill> candidateSkills;

}
