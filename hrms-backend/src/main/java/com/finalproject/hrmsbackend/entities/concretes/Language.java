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
@Table(name = "languages")
public class Language implements BaseEntity<Short> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "languages_id_generator")
    @SequenceGenerator(name = "languages_id_generator", sequenceName = "languages_id_seq", allocationSize = 1, initialValue = 30)
    @Column(name = "id")
    private Short id;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    public Language(short id) {
        this.id = id;
    }

    public Language(String name) {
        this.name = name;
    }
}
