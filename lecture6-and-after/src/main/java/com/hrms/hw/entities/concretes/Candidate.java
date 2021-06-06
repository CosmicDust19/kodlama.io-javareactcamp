package com.hrms.hw.entities.concretes;

import com.hrms.hw.core.entities.User;
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

    //I made this one to many because i looked at some sites and they takes more than one cv
    @OneToMany(mappedBy = "candidate")
    private List<CandidateCv> candidateCvs;

    @OneToMany(mappedBy = "candidate")
    private List<CandidateImage> candidateImages;

    @OneToMany(mappedBy = "candidate")
    private List<CandidateJobExperience> candidateJobExperiences;

    @OneToMany(mappedBy = "candidate")
    private List<CandidateLanguage> candidateLanguages;

    @OneToMany(mappedBy = "candidate")
    private List<CandidateSchool> candidateSchools;

    @OneToMany(mappedBy = "candidate")
    private List<CandidateSkill> candidateSkillList;

}
