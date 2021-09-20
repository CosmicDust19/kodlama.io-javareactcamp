package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalproject.hrmsbackend.core.entities.BaseEntity;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "cities")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class City implements BaseEntity<Short> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cities_id_generator")
    @SequenceGenerator(name = "cities_id_generator", sequenceName = "cities_id_seq", allocationSize = 1, initialValue = 82)
    @Column(name = "id")
    private Short id;

    @Column(name = "name", nullable = false, unique = true, length = Utils.Const.MAX_CITY_NAME)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "city")
    @JsonIgnoreProperties(value = {"city"})
    @ToString.Exclude
    private List<JobAdvertisement> jobAdvertisements;

    public City(short id) {
        this.id = id;
    }

    public City(String name) {
        this.name = name;
    }

}
