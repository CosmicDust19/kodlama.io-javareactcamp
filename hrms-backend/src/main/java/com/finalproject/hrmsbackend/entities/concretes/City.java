package com.finalproject.hrmsbackend.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.finalproject.hrmsbackend.entities.abstracts.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
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
    private short id;

    @NotBlank(message = "cannot be empty")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "city")
    @JsonIgnoreProperties(value = {"city"})
    private List<JobAdvertisement> jobAdvertisements;

    public Short getId() {
        return id;
    }

    public void setId(Short id) {
        this.id = id;
    }
}
