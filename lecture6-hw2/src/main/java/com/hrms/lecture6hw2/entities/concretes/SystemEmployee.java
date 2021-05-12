package com.hrms.lecture6hw2.entities.concretes;


import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "system_employees")
public class SystemEmployee {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private int staffId;

    @Column(name = "first_name")
    private int firstName;

    @Column(name = "last_name")
    private int lastName;

    public SystemEmployee(int staffId, int firstName, int lastName) {
        this.staffId = staffId;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public SystemEmployee() {

    }
}
