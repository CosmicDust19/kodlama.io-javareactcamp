package com.hrms.hw.entities.concretes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "employers")
@PrimaryKeyJoinColumn(name = "employer_id", referencedColumnName = "id")
public class Employer extends User {

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "web_site")
    private String webSite;

    @Column(name = "phone_number")
    private String phoneNumber;

    public Employer(int id, String email, String password, String companyName, String webSite, String phoneNumber){
        super(id,email,password);
        this.companyName = companyName;
        this.webSite = webSite;
        this.phoneNumber = phoneNumber;
    }

}
