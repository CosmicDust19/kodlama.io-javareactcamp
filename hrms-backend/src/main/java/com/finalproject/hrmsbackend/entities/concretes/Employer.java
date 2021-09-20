package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.entities.User;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.*;

import javax.persistence.*;
import java.util.List;


@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "employers")
@PrimaryKeyJoinColumn(name = "user_id", referencedColumnName = "id")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Employer extends User {

    @Column(name = "company_name", nullable = false, unique = true, length = Utils.Const.MAX_COMPANY_NAME)
    private String companyName;

    @Column(name = "website", nullable = false, unique = true, length = 200)
    private String website;

    @Column(name = "phone_number", nullable = false, length = 22)
    private String phoneNumber;

    @OneToOne
    @JoinColumn(name = "update_id", referencedColumnName = "employer_update_id")
    private EmployerUpdate employerUpdate;

    @Column(name = "verified", nullable = false)
    private boolean verified;

    @Column(name = "rejected")
    private Boolean rejected;

    @Column(name = "update_verified")
    private Boolean updateVerified;

    @OneToMany(mappedBy = "employer", fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = {"employer"})
    private List<JobAdvertisement> jobAdvertisements;

}
