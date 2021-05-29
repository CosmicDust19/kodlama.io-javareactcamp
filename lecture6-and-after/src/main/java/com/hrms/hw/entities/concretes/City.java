package com.hrms.hw.entities.concretes;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "cities")
public class City {

    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;
}
