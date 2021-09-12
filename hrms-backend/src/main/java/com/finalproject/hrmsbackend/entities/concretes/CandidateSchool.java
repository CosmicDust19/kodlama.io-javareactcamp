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
@Table(name = "candidates_schools", uniqueConstraints = {@UniqueConstraint(columnNames = {"candidate_id", "school_id", "department_id"})})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CandidateSchool implements CvProp {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "candidates_schools_id_generator")
    @SequenceGenerator(name = "candidates_schools_id_generator", sequenceName = "candidates_schools_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnoreProperties(value = {"cvs", "candidateImages", "candidateJobExperiences",
            "candidateLanguages", "candidateSchools", "candidateSkills"})
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "start_year", nullable = false)
    private Short startYear;

    @Column(name = "graduation_year")
    private Short graduationYear;

}
