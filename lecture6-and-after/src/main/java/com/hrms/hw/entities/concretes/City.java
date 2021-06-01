package com.hrms.hw.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "cities")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "jobAdvertisements"})
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cities_id_generator")
    @SequenceGenerator(name = "cities_id_generator", sequenceName = "cities_id_seq", allocationSize = 1, initialValue = 82)
    @JsonIgnore
    @Column(name = "id")
    private short id;

    @Column(name = "name", unique = true)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "city")
    private List<JobAdvertisement> jobAdvertisements;

    public City(short id) {
        this.id = id;
    }

}
