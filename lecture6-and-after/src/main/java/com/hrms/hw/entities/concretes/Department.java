package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "departments_id_generator")
    @SequenceGenerator(name = "departments_id_generator", sequenceName = "departments_id_seq", allocationSize = 1)
    @JsonIgnore
    @Column(name = "id")
    private short id;

    @Column(name = "name")
    private String name;
}
