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

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "nationality_id", nullable = false, unique = true, length = 11)
    private String nationalityId;

    @Column(name = "birth_year", nullable = false)
    private Short birthYear;

    @Column(name = "github_account", length = 100)
    private String githubAccount;

    @Column(name = "linkedin_account", length = 100)
    private String linkedinAccount;

    @OneToMany(mappedBy = "candidate")
    @JsonIgnoreProperties(value = {"candidate"})
    private List<Cv> cvs;

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

    @ManyToMany
    @JoinTable(name = "candidates_favorite_job_advertisements",
            joinColumns = {@JoinColumn(name = "candidate_id", referencedColumnName = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "job_advertisement_id", referencedColumnName = "id")})
    private List<JobAdvertisement> favoriteJobAdvertisements;

    public Candidate(int id) {
        super(id);
    }

}
