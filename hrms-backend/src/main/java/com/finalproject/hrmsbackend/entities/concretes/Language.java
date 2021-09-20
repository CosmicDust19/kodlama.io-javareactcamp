package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "languages")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Language implements BaseEntity<Short> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "languages_id_generator")
    @SequenceGenerator(name = "languages_id_generator", sequenceName = "languages_id_seq", allocationSize = 1, initialValue = 30)
    @Column(name = "id")
    private Short id;

    @Column(name = "name", nullable = false, unique = true, length = Utils.Const.MAX_LANGUAGE_NAME)
    private String name;

    public Language(short id) {
        this.id = id;
    }

    public Language(String name) {
        this.name = name;
    }

}
