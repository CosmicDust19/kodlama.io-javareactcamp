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
    @SequenceGenerator(name = "languages_id_generator", sequenceName = "languages_id_seq", allocationSize = 1, initialValue = 30)
    @JsonIgnore
    @Column(name = "id")
    private short id;

    @NotBlank(message = "cannot be empty")
    @Pattern(regexp = "\\w+", message = "invalid language name")
    @Column(name = "name", nullable = false, unique = true)
    private String name;
}
