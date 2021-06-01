package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.AssertTrue;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_id_generator")
    // note: sequenceName should not be the same as any of your database's sequence name
    @SequenceGenerator(name = "users_id_generator", sequenceName = "users_id_seq", allocationSize = 1)
    @JsonIgnore
    @Column(name = "id")
    private int id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @JsonIgnore
    @Column(name = "is_email_verified", nullable = false)
    private boolean isEmailVerified = true; //temporary

    @JsonIgnore
    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;
}