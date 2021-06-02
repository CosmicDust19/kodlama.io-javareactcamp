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
@Table(name = "software_knowledge")
public class SoftwareKnowledge {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "software_knowledge_id_generator")
    @SequenceGenerator(name = "software_knowledge_id_generator", sequenceName = "software_knowledge_id_seq", allocationSize = 1)
    @JsonIgnore
    @Column(name = "id")
    private short id;

    @NotBlank(message = "This field can't be empty.")
    @Pattern(regexp = "\\w+", message = "Please enter the field properly.")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    public SoftwareKnowledge(short id) {
        this.id = id;
    }
}
