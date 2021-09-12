package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.entities.abstracts.CvProp;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "candidates_skills", uniqueConstraints = {@UniqueConstraint(columnNames = {"candidate_id", "skill_id"})})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CandidateSkill implements CvProp {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidates_skills_id_generator")
    @SequenceGenerator(name = "candidates_skills_id_generator", sequenceName = "candidates_skills_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnoreProperties(value = {"cvs", "candidateImages", "candidateJobExperiences",
            "candidateLanguages", "candidateSchools", "candidateSkills"})
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

}
