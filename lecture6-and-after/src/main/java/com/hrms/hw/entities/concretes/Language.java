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
@Table(name = "languages")
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "languages_id_generator")
    @SequenceGenerator(name = "languages_id_generator", sequenceName = "languages_id_seq", allocationSize = 1)
    @JsonIgnore
    @Column(name = "id")
    private short id;

    @NotBlank(message = "This field can't be empty.")
    @Pattern(regexp = "\\w+", message = "Please enter the language properly.")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    public Language(short id) {
        this.id = id;
    }
}
