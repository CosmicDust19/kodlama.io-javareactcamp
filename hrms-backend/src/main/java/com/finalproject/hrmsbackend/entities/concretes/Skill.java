package com.finalproject.hrmsbackend.entities.concretes;

import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "skills")
public class Skill implements BaseEntity<Short> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "skills_id_generator")
    @SequenceGenerator(name = "skills_id_generator", sequenceName = "skills_id_seq", allocationSize = 1, initialValue = 19)
    @Column(name = "id")
    private Short id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    public Skill(short id) {
        this.id = id;
    }

    public Skill(String name) {
        this.name = name;
    }
}
