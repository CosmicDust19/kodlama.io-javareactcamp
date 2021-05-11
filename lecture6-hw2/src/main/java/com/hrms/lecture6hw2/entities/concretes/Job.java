package com.hrms.lecture6hw2.entities.concretes;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "detail")
    private String detail;

    @Column(name = "sector_name")
    private String sectorName;

    public Job(int id, String title, String detail, String sectorName) {
        this.id = id;
        this.title = title;
        this.detail = detail;
        this.sectorName = sectorName;
    }

    public Job() {

    }
}
