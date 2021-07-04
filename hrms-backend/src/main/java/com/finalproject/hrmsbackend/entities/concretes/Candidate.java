package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "candidates")
@PrimaryKeyJoinColumn(name = "user_id", referencedColumnName = "id")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Candidate extends User {

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "nationality_id", nullable = false, unique = true)
    private String nationalityId;

    @Column(name = "birth_year", nullable = false)
    private short birthYear;

    @Column(name = "github_account_link")
    private String githubAccountLink;

    @Column(name = "linkedin_account_link")
    private String linkedinAccountLink;

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = {"candidate"})
    private List<CandidateCv> candidateCvs;

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = {"candidate"})
    private List<CandidateImage> candidateImages;

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = {"candidate"})
    private List<CandidateJobExperience> candidateJobExperiences;

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = {"candidate"})
    private List<CandidateLanguage> candidateLanguages;

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = {"candidate"})
    private List<CandidateSchool> candidateSchools;

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = {"candidate"})
    private List<CandidateSkill> candidateSkills;

    public Candidate(int id) {
        super(id);
    }
}
