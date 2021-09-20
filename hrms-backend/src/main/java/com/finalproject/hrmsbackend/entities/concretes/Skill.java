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
@Table(name = "skills")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Skill implements BaseEntity<Short> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "skills_id_generator")
    @SequenceGenerator(name = "skills_id_generator", sequenceName = "skills_id_seq", allocationSize = 1, initialValue = 19)
    @Column(name = "id")
    private Short id;

    @Column(name = "name", nullable = false, unique = true, length = Utils.Const.MAX_SKILL_NAME)
    private String name;

    public Skill(short id) {
        this.id = id;
    }

    public Skill(String name) {
        this.name = name;
    }

}
