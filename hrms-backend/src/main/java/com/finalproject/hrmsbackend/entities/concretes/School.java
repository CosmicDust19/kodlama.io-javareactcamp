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
@Table(name = "schools")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class School implements BaseEntity<Integer> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "schools_id_generator")
    @SequenceGenerator(name = "schools_id_generator", sequenceName = "schools_id_seq", allocationSize = 1, initialValue = 54)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false, unique = true, length = Utils.Const.MAX_SCHOOL_NAME)
    private String name;

    public School(int id) {
        this.id = id;
    }

    public School(String name) {
        this.name = name;
    }

}
