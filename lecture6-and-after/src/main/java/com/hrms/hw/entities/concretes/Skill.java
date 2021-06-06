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
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "skills_id_generator")
    @SequenceGenerator(name = "skills_id_generator", sequenceName = "skills_id_seq", allocationSize = 1, initialValue = 19)
    @JsonIgnore
    @Column(name = "id")
    private short id;

    @NotBlank(message = "cannot be empty")
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

}
