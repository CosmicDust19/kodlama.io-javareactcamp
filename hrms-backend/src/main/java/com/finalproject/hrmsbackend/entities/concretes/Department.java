package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "departments")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Department implements BaseEntity<Short> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "departments_id_generator")
    @SequenceGenerator(name = "departments_id_generator", sequenceName = "departments_id_seq", allocationSize = 1, initialValue = 39)
    @Column(name = "id")
    private Short id;

    @Column(name = "name", nullable = false, unique = true, length = Utils.Const.MAX_DEPARTMENT_NAME)
    private String name;

    public Department(short id) {
        this.id = id;
    }

    public Department(String name) {
        this.name = name;
    }

}
