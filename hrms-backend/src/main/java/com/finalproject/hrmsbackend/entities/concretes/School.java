package com.finalproject.hrmsbackend.entities.concretes;

import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "schools")
public class School implements BaseEntity<Integer> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "schools_id_generator")
    @SequenceGenerator(name = "schools_id_generator", sequenceName = "schools_id_seq", allocationSize = 1, initialValue = 54)
    @Column(name = "id")
    private Integer id;

    @NotBlank(message = "Empty")
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    public School(int id) {
        this.id = id;
    }

}
