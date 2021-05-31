package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    @Column(name = "id")
    private int id;

    @Column(name = "email")
    @Email
    private String email;

    @Column(name = "password")
    private String password;

    @JsonIgnore
    @Column(name = "created_at")
    private LocalDate createdAt;

    public User (int id){
        this.id = id;
    }
}