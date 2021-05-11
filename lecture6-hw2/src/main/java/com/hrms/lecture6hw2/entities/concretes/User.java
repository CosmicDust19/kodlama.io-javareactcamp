package com.hrms.lecture6hw2.entities.concretes;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private int id;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "is_email_verified")
    private boolean isEmailVerified;

    public User(int id, String email, String password, boolean isEmailVerified) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.isEmailVerified = isEmailVerified;
    }

    public User() {

    }
}
