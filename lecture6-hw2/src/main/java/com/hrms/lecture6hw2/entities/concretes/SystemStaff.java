package com.hrms.lecture6hw2.entities.concretes;


import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "system_staff")
public class SystemStaff {

    @Id
    @GeneratedValue
    @Column(name = "staff_id")
    private int staffId;

    @Column(name = "first_name")
    private int firstName;

    @Column(name = "last_name")
    private int lastName;

    @Column(name = "email")
    private int email;

    public SystemStaff(int staffId, int firstName, int lastName, int email) {
        this.staffId = staffId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public SystemStaff() {

    }
}
