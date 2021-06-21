package com.finalproject.hrmsbackend.entities.concretes;

import com.finalproject.hrmsbackend.entities.abstracts.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

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
    private short id;

    @NotBlank(message = "cannot be empty")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    public Short getId() {
        return id;
    }

    public void setId(Short id) {
        this.id = id;
    }
}
