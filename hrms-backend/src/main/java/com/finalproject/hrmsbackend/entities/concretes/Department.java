package com.finalproject.hrmsbackend.entities.concretes;

import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "departments")
public class Department implements BaseEntity<Short> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "departments_id_generator")
    @SequenceGenerator(name = "departments_id_generator", sequenceName = "departments_id_seq", allocationSize = 1, initialValue = 39)
    @Column(name = "id")
    private Short id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    public Department(short id) {
        this.id = id;
    }

    public Department(String name) {
        this.name = name;
    }

}
