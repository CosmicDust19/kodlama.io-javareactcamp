package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "schools")
public class School {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "schools_id_generator")
    @SequenceGenerator(name = "schools_id_generator", sequenceName = "schools_id_seq", allocationSize = 1)
    @JsonIgnore
    @Column(name = "id")
    private int id;

    @NotBlank(message = "This field can't be empty.")
    @Pattern(regexp = "\\w+", message = "Please enter the school name properly.")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    public School(int id) {
        this.id = id;
    }
}
