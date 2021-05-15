package com.hrms.lecture6hw2.entities.concretes;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "employers")
public class Employer{

    @Id
    @GeneratedValue
    @Column(name = "id")
    private int employerId;

    @Column(name = "company_name")
    private int companyName;

    @Column(name = "web_site")
    private int web_site;

    @Column(name = "phone_number")
    private int phoneNumber;

    public Employer(int employerId, int companyName, int web_site, int phoneNumber) {
        this.employerId = employerId;
        this.companyName = companyName;
        this.web_site = web_site;
        this.phoneNumber = phoneNumber;
    }

    public Employer() {

    }
}