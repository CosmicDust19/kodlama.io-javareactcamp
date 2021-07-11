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
@Table(name = "employers")
@PrimaryKeyJoinColumn(name = "user_id", referencedColumnName = "id")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Employer extends User {

    @Column(name = "company_name", nullable = false, unique = true)
    private String companyName;

    @Column(name = "website", nullable = false, unique = true)
    private String website;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "is_system_verified", nullable = false)
    private boolean systemVerificationStatus;

    @Column(name = "is_system_rejected")
    private Boolean systemRejectionStatus;

    @OneToMany(mappedBy = "employer", fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = {"employer"})
    private List<JobAdvertisement> jobAdvertisements;

}
