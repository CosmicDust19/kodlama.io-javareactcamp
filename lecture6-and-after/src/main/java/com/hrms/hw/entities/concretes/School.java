package com.hrms.hw.entities.concretes;

import com.hrms.hw.entities.abstracts.BaseEntity;
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
public class School implements BaseEntity<Integer> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "schools_id_generator")
    @SequenceGenerator(name = "schools_id_generator", sequenceName = "schools_id_seq", allocationSize = 1)
    @Column(name = "id")
    private int id;

    @NotBlank(message = "cannot be empty.")
    @Pattern(regexp = "\\w+", message = "invalid school name")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
